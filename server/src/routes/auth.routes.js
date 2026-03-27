import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { signAuthToken } from "../utils/jwt.js";
import { resolveEffectiveRole, toAuthUser } from "../utils/adminAccess.js";
import { env } from "../config/env.js";
import { AgentMessage } from "../models/AgentMessage.js";
import { emitNewMessage } from "../realtime/socket.js";
import mongoose from "mongoose";

const router = Router();

const toAuthPayload = (user) => ({
  user: toAuthUser(user),
  token: signAuthToken({
    sub: user._id.toString(),
    role: resolveEffectiveRole(user),
  }),
});

const VALID_SERVICE_TYPES = new Set([
  "credit_repair",
  "tax_services",
  "comprehensive",
]);

const SERVICE_TYPE_LABELS = {
  credit_repair: "Credit Repair",
  tax_services: "Tax Services",
  comprehensive: "Comprehensive Plan",
};

const serializeMessage = (message) => ({
  ...message,
  _id: message._id.toString(),
  senderId: message.senderId.toString(),
  recipientId: message.recipientId.toString(),
});

const getAgentsWithClientCounts = async () => {
  const [agents, assignedCounts] = await Promise.all([
    User.find({ role: "agent", status: "active" })
      .select("name email profilePhoto phone bio createdAt")
      .sort({ createdAt: -1 })
      .lean(),
    User.aggregate([
      { $match: { assignedAgentId: { $ne: null } } },
      { $group: { _id: "$assignedAgentId", clientCount: { $sum: 1 } } },
    ]),
  ]);

  const countsByAgent = assignedCounts.reduce((acc, row) => {
    acc[row._id.toString()] = row.clientCount;
    return acc;
  }, {});

  return agents.map((agent) => ({
    ...agent,
    clientCount: countsByAgent[agent._id.toString()] || 0,
  }));
};

const createAgentSelectionRequest = async ({
  userId,
  userName,
  agentId,
  serviceType,
}) => {
  const serviceLabel =
    SERVICE_TYPE_LABELS[serviceType] || "selected CreditFix Pro service";
  const createdMessage = await AgentMessage.create({
    senderId: userId,
    recipientId: agentId,
    content: `Hi, I'm ${userName}. I registered for ${serviceLabel} and selected you as my CreditFix Pro agent. I'd like to get started.`,
  });

  emitNewMessage(serializeMessage(createdMessage.toObject()));
};

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, address, serviceType } = req.body || {};

    if (!name || !email || !password || !serviceType) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name, email, password and serviceType are required",
      });
    }

    const normalizedServiceType = String(serviceType);
    if (!VALID_SERVICE_TYPES.has(normalizedServiceType)) {
      return res.status(400).json({
        error: "ValidationError",
        message:
          "Invalid serviceType. Expected credit_repair, tax_services or comprehensive",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      phone: phone || "",
      address: address || undefined,
      selectedService: normalizedServiceType,
    });

    await user.populate({
      path: "assignedAgentId",
      select: "name email profilePhoto phone bio",
    });

    return res.status(201).json(toAuthPayload(user));
  } catch (error) {
    return next(error);
  }
});

router.post("/register-agent", async (req, res, next) => {
  try {
    const { name, email, password, accessKey, phone, address } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name, email and password are required",
      });
    }

    if (!env.agentRegistrationKey) {
      return res.status(503).json({
        error: "ConfigurationError",
        message: "Agent registration is not configured",
      });
    }

    if (!accessKey || accessKey !== env.agentRegistrationKey) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid agent registration key",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const agent = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "agent",
      phone: phone || "",
      address: address || undefined,
    });

    return res.status(201).json(toAuthPayload(agent));
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: "ValidationError",
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Account suspended",
      });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    await user.populate({
      path: "assignedAgentId",
      select: "name email profilePhoto phone bio",
    });

    return res.json(toAuthPayload(user));
  } catch (error) {
    return next(error);
  }
});

router.get("/agents/public", async (_req, res, next) => {
  try {
    const agents = await getAgentsWithClientCounts();
    res.json(agents);
  } catch (error) {
    next(error);
  }
});

router.get("/agents", requireAuth, async (_req, res, next) => {
  try {
    const agents = await getAgentsWithClientCounts();
    res.json(agents);
  } catch (error) {
    next(error);
  }
});

router.patch("/me/agent", requireAuth, async (req, res, next) => {
  try {
    if (req.auth?.role !== "user" && req.auth?.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only users and admins can use this endpoint",
      });
    }

    const isUserRequest = req.auth?.role === "user";

    if (isUserRequest && !req.user.selectedService) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Please select a service before choosing an agent",
      });
    }

    if (isUserRequest && req.user.assignedAgentId) {
      return res.status(403).json({
        error: "Forbidden",
        message:
          "You already have an assigned agent. Please contact support to change assignment",
      });
    }

    const { agentId } = req.body || {};

    if ((agentId === null || agentId === "") && isUserRequest) {
      return res.status(400).json({
        error: "ValidationError",
        message: "agentId is required",
      });
    }

    if ((agentId === null || agentId === "") && !isUserRequest) {
      req.user.assignedAgentId = null;
      await req.user.save();
      return res.json({ user: toAuthUser(req.user) });
    }

    if (!mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid agentId",
      });
    }

    const selectedAgent = await User.findOne({
      _id: agentId,
      role: "agent",
      status: "active",
    })
      .select("_id")
      .lean();

    if (!selectedAgent) {
      return res.status(404).json({
        error: "NotFound",
        message: "Agent not found",
      });
    }

    const previousAgentId = req.user.assignedAgentId?.toString() || null;
    req.user.assignedAgentId = selectedAgent._id;
    await req.user.save();

    if (isUserRequest && previousAgentId !== selectedAgent._id.toString()) {
      await createAgentSelectionRequest({
        userId: req.user._id,
        userName: req.user.name,
        agentId: selectedAgent._id,
        serviceType: req.user.selectedService,
      });
    }

    await req.user.populate({
      path: "assignedAgentId",
      select: "name email profilePhoto phone bio",
    });

    return res.json({ user: toAuthUser(req.user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    await req.user.populate({
      path: "assignedAgentId",
      select: "name email profilePhoto phone bio",
    });
    res.json({ user: toAuthUser(req.user) });
  } catch (error) {
    next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const allowed = ["name", "profilePhoto", "bio", "phone", "address"];
    for (const key of allowed) {
      if (req.body?.[key] !== undefined) {
        req.user[key] = req.body[key];
      }
    }
    await req.user.save();
    await req.user.populate({
      path: "assignedAgentId",
      select: "name email profilePhoto phone bio",
    });
    res.json({ user: toAuthUser(req.user) });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, (_req, res) => {
  res.status(204).send();
});

export default router;
