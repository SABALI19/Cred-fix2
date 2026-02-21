import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { signAuthToken } from "../utils/jwt.js";
import { resolveEffectiveRole, toAuthUser } from "../utils/adminAccess.js";
import { env } from "../config/env.js";
import mongoose from "mongoose";

const router = Router();

const toAuthPayload = (user) => ({
  user: toAuthUser(user),
  token: signAuthToken({
    sub: user._id.toString(),
    role: resolveEffectiveRole(user),
  }),
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name, email and password are required",
      });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({
        error: "Conflict",
        message: "Email already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone: phone || "",
      address: address || undefined,
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

router.get("/agents", requireAuth, async (_req, res, next) => {
  try {
    const [agents, assignedCounts] = await Promise.all([
      User.find({ role: "agent" })
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

    res.json(
      agents.map((agent) => ({
        ...agent,
        clientCount: countsByAgent[agent._id.toString()] || 0,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/me/agent", requireAuth, async (req, res, next) => {
  try {
    if (req.auth?.role !== "user" && req.auth?.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only users can select agents",
      });
    }

    const { agentId } = req.body || {};

    if (agentId === null || agentId === "") {
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
    })
      .select("_id")
      .lean();

    if (!selectedAgent) {
      return res.status(404).json({
        error: "NotFound",
        message: "Agent not found",
      });
    }

    req.user.assignedAgentId = selectedAgent._id;
    await req.user.save();
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
