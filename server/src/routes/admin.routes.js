import { Router } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ConsultationRequest } from "../models/ConsultationRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { CreditAccount } from "../models/CreditAccount.js";
import { CreditScore } from "../models/CreditScore.js";
import { Dispute } from "../models/Dispute.js";
import { PlatformControl } from "../models/PlatformControl.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { toAuthUser } from "../utils/adminAccess.js";
import { ensureAgentAssignmentRequest } from "../utils/agentAssignment.js";

const router = Router();

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

const buildMonthBuckets = (count = 6) => {
  const months = [];
  const now = new Date();

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const monthDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
    );
    const year = monthDate.getUTCFullYear();
    const month = monthDate.getUTCMonth() + 1;
    const key = `${year}-${String(month).padStart(2, "0")}`;
    months.push({
      key,
      label: monthFormatter.format(monthDate),
      start: monthDate,
    });
  }

  return months;
};

const aggregateMonthlyCounts = async (Model, months) => {
  if (months.length === 0) return {};

  const start = months[0].start;
  const rows = await Model.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  return rows.reduce((acc, row) => {
    const key = `${row._id.year}-${String(row._id.month).padStart(2, "0")}`;
    acc[key] = row.count;
    return acc;
  }, {});
};

const getCount = (rows, key) => rows.find((row) => row._id === key)?.count || 0;

const CHART_KEYS = [
  "creditScore",
  "disputes",
  "accountStatus",
  "monthlyTrend",
  "recentActivity",
];

const SERVICE_KEYS = ["taxServices", "creditScoreServices"];
const USER_UPDATE_FIELDS = [
  "name",
  "email",
  "role",
  "status",
  "selectedService",
  "phone",
  "profilePhoto",
  "bio",
];
const ALLOWED_USER_ROLES = new Set(["user", "agent", "admin"]);
const ALLOWED_USER_STATUSES = new Set(["active", "suspended"]);
const ALLOWED_SERVICE_TYPES = new Set([
  "credit_repair",
  "tax_services",
  "comprehensive",
]);
const ALLOWED_SUPPORT_STATUSES = new Set([
  "open",
  "in-progress",
  "waiting",
  "resolved",
  "closed",
]);
const ALLOWED_SUPPORT_PRIORITIES = new Set(["low", "medium", "high", "urgent"]);
const ALLOWED_CONTACT_STATUSES = new Set(["new", "in-review", "resolved", "closed"]);
const ALLOWED_CONSULTATION_STATUSES = new Set(["new", "contacted", "booked", "closed"]);
const ALLOWED_DISPUTE_STATUSES = new Set(["pending", "investigating", "resolved", "rejected"]);
const ALLOWED_DISPUTE_PRIORITIES = new Set(["low", "medium", "high"]);
const ALLOWED_ACCOUNT_TYPES = new Set([
  "credit_card",
  "auto_loan",
  "mortgage",
  "personal_loan",
  "student_loan",
  "other",
]);
const ALLOWED_ACCOUNT_STATUSES = new Set(["open", "closed", "dispute"]);
const ALLOWED_BUREAUS = new Set(["experian", "equifax", "transunion"]);
const ALLOWED_DISPUTE_BUREAUS = new Set(["experian", "equifax", "transunion", "all"]);

const ensurePlatformControl = async () => {
  const existing = await PlatformControl.findOne({ singletonKey: "default" });
  if (existing) {
    return existing;
  }

  return PlatformControl.create({ singletonKey: "default" });
};

const toPlatformControlPayload = (doc) => ({
  charts: {
    creditScore: { enabled: Boolean(doc.charts?.creditScore?.enabled) },
    disputes: { enabled: Boolean(doc.charts?.disputes?.enabled) },
    accountStatus: { enabled: Boolean(doc.charts?.accountStatus?.enabled) },
    monthlyTrend: { enabled: Boolean(doc.charts?.monthlyTrend?.enabled) },
    recentActivity: { enabled: Boolean(doc.charts?.recentActivity?.enabled) },
  },
  services: {
    taxServices: {
      enabled: Boolean(doc.services?.taxServices?.enabled),
      title: doc.services?.taxServices?.title || "",
      description: doc.services?.taxServices?.description || "",
      ctaLabel: doc.services?.taxServices?.ctaLabel || "",
    },
    creditScoreServices: {
      enabled: Boolean(doc.services?.creditScoreServices?.enabled),
      title: doc.services?.creditScoreServices?.title || "",
      description: doc.services?.creditScoreServices?.description || "",
      ctaLabel: doc.services?.creditScoreServices?.ctaLabel || "",
    },
  },
  updatedAt: doc.updatedAt,
});

const applyPlatformControlPatch = (doc, patch = {}) => {
  const errors = [];

  if (patch.charts !== undefined) {
    if (!patch.charts || typeof patch.charts !== "object" || Array.isArray(patch.charts)) {
      errors.push("charts must be an object");
    } else {
      for (const key of CHART_KEYS) {
        const nextChartControl = patch.charts[key];
        if (nextChartControl === undefined) continue;

        if (
          !nextChartControl ||
          typeof nextChartControl !== "object" ||
          Array.isArray(nextChartControl)
        ) {
          errors.push(`charts.${key} must be an object`);
          continue;
        }

        if (
          Object.prototype.hasOwnProperty.call(nextChartControl, "enabled") &&
          typeof nextChartControl.enabled !== "boolean"
        ) {
          errors.push(`charts.${key}.enabled must be a boolean`);
          continue;
        }

        if (Object.prototype.hasOwnProperty.call(nextChartControl, "enabled")) {
          doc.charts[key].enabled = nextChartControl.enabled;
        }
      }
    }
  }

  if (patch.services !== undefined) {
    if (!patch.services || typeof patch.services !== "object" || Array.isArray(patch.services)) {
      errors.push("services must be an object");
    } else {
      for (const key of SERVICE_KEYS) {
        const nextServiceControl = patch.services[key];
        if (nextServiceControl === undefined) continue;

        if (
          !nextServiceControl ||
          typeof nextServiceControl !== "object" ||
          Array.isArray(nextServiceControl)
        ) {
          errors.push(`services.${key} must be an object`);
          continue;
        }

        if (
          Object.prototype.hasOwnProperty.call(nextServiceControl, "enabled") &&
          typeof nextServiceControl.enabled !== "boolean"
        ) {
          errors.push(`services.${key}.enabled must be a boolean`);
          continue;
        }

        for (const field of ["title", "description", "ctaLabel"]) {
          if (
            Object.prototype.hasOwnProperty.call(nextServiceControl, field) &&
            typeof nextServiceControl[field] !== "string"
          ) {
            errors.push(`services.${key}.${field} must be a string`);
          }
        }

        if (Object.prototype.hasOwnProperty.call(nextServiceControl, "enabled")) {
          doc.services[key].enabled = nextServiceControl.enabled;
        }
        if (Object.prototype.hasOwnProperty.call(nextServiceControl, "title")) {
          doc.services[key].title = nextServiceControl.title.trim();
        }
        if (Object.prototype.hasOwnProperty.call(nextServiceControl, "description")) {
          doc.services[key].description = nextServiceControl.description.trim();
        }
        if (Object.prototype.hasOwnProperty.call(nextServiceControl, "ctaLabel")) {
          doc.services[key].ctaLabel = nextServiceControl.ctaLabel.trim();
        }
      }
    }
  }

  return errors;
};

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const parseLimit = (value, fallback = 200, max = 500) => {
  const parsed = Number(value || fallback);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.min(parsed, max);
};

const requireObjectIdParam = (res, value, fieldName = "id") => {
  if (!isValidObjectId(value)) {
    res.status(400).json({
      error: "ValidationError",
      message: `Invalid ${fieldName}`,
    });
    return false;
  }

  return true;
};

const buildAddressPayload = (address) => {
  if (address === undefined) {
    return undefined;
  }

  if (!address || typeof address !== "object" || Array.isArray(address)) {
    return null;
  }

  return {
    streetAddress: String(address.streetAddress || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    zipCode: String(address.zipCode || "").trim(),
  };
};

const getManagedUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  await user.populate({
    path: "assignedAgentId",
    select: "name email profilePhoto phone bio status",
  });

  return user;
};

const toManagedUserPayload = (user, { latestScoresByBureau = [], disputeCount = 0 } = {}) => ({
  ...toAuthUser(user),
  latestScoresByBureau,
  disputeCount,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUserDataSnapshot = async (userId) => {
  const [accounts, scores, disputes] = await Promise.all([
    CreditAccount.find({ userId }).sort({ createdAt: -1 }).lean(),
    CreditScore.find({ userId }).sort({ createdAt: -1 }).lean(),
    Dispute.find({ userId }).sort({ createdAt: -1 }).lean(),
  ]);

  const accountSummary = accounts.reduce(
    (summary, account) => {
      summary.totalAccounts += 1;
      summary.totalBalance += account.balance || 0;
      summary.totalLimit += account.creditLimit || 0;
      return summary;
    },
    {
      totalAccounts: 0,
      totalBalance: 0,
      totalLimit: 0,
      utilization: 0,
    },
  );

  accountSummary.utilization =
    accountSummary.totalLimit > 0
      ? (accountSummary.totalBalance / accountSummary.totalLimit) * 100
      : 0;

  const latestScoresByBureau = Array.from(
    scores.reduce((map, score) => {
      if (!map.has(score.bureau)) {
        map.set(score.bureau, score);
      }
      return map;
    }, new Map()).values(),
  );

  return {
    accounts,
    scores,
    disputes,
    latestScoresByBureau,
    disputeCount: disputes.length,
    accountSummary,
  };
};

const normalizeActivePlan = (activePlan = {}) => ({
  name: activePlan?.name || "",
  price: activePlan?.price ?? null,
  serviceType: activePlan?.serviceType || "",
  startedAt: activePlan?.startedAt || null,
});

const toAppointmentPayload = (appointment) => ({
  id: appointment._id.toString(),
  user: {
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone || "",
  },
  serviceType: appointment.serviceType || null,
  plan: {
    name: appointment.plan?.name || "",
    price: appointment.plan?.price ?? null,
  },
  agent: {
    id: appointment.agent?.id || "",
    name: appointment.agent?.name || "",
    title: appointment.agent?.title || "",
  },
  schedule: {
    date: appointment.schedule?.date || "",
    time: appointment.schedule?.time || "",
    consultationType: appointment.schedule?.consultationType || "",
  },
  status: appointment.status,
  createdAt: appointment.createdAt,
});

const applyManagedUserPatch = async ({ actorId, targetUser, patch }) => {
  const errors = [];

  for (const field of USER_UPDATE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(patch, field)) {
      continue;
    }

    const nextValue = patch[field];

    if (field === "email") {
      const normalizedEmail = String(nextValue || "").toLowerCase().trim();
      if (!normalizedEmail) {
        errors.push("email is required");
        continue;
      }
      if (targetUser._id.toString() === actorId.toString()) {
        errors.push("You cannot change your own email");
        continue;
      }

      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: targetUser._id },
      })
        .select("_id")
        .lean();
      if (existing) {
        errors.push("Email already in use");
        continue;
      }

      targetUser.email = normalizedEmail;
      continue;
    }

    if (field === "role") {
      const normalizedRole = String(nextValue || "").trim();
      if (!ALLOWED_USER_ROLES.has(normalizedRole)) {
        errors.push("role must be user, agent or admin");
        continue;
      }
      if (targetUser._id.toString() === actorId.toString()) {
        errors.push("You cannot change your own role");
        continue;
      }
      targetUser.role = normalizedRole;
      continue;
    }

    if (field === "status") {
      const normalizedStatus = String(nextValue || "").trim();
      if (!ALLOWED_USER_STATUSES.has(normalizedStatus)) {
        errors.push("status must be active or suspended");
        continue;
      }
      if (targetUser._id.toString() === actorId.toString()) {
        errors.push("You cannot change your own status");
        continue;
      }
      targetUser.status = normalizedStatus;
      continue;
    }

    if (field === "selectedService") {
      if (nextValue === null || nextValue === "") {
        targetUser.selectedService = null;
        continue;
      }
      const normalizedService = String(nextValue);
      if (!ALLOWED_SERVICE_TYPES.has(normalizedService)) {
        errors.push("selectedService is invalid");
        continue;
      }
      targetUser.selectedService = normalizedService;
      continue;
    }

    targetUser[field] = typeof nextValue === "string" ? nextValue.trim() : nextValue;
  }

  if (Object.prototype.hasOwnProperty.call(patch, "address")) {
    const nextAddress = buildAddressPayload(patch.address);
    if (nextAddress === null) {
      errors.push("address must be an object");
    } else if (nextAddress) {
      targetUser.address = nextAddress;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, "assignedAgentId")) {
    const nextAgentId = patch.assignedAgentId;
    if (nextAgentId === null || nextAgentId === "") {
      targetUser.assignedAgentId = null;
    } else if (!isValidObjectId(nextAgentId)) {
      errors.push("assignedAgentId must be a valid id");
    } else {
      const agent = await User.findOne({
        _id: nextAgentId,
        role: "agent",
        status: "active",
      })
        .select("_id")
        .lean();

      if (!agent) {
        errors.push("Assigned agent not found");
      } else {
        targetUser.assignedAgentId = agent._id;
      }
    }
  }

  if (targetUser.role !== "user") {
    targetUser.selectedService = null;
    targetUser.assignedAgentId = null;
  }

  return errors;
};

router.use(requireAuth);
router.use(requireAdmin);

router.get("/agents", async (_req, res, next) => {
  try {
    const agents = await User.find({ role: "agent" })
      .sort({ createdAt: -1 })
      .select("name email role status phone createdAt updatedAt")
      .lean();

    res.json(agents);
  } catch (error) {
    next(error);
  }
});

router.post("/agents", async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name, email and password are required",
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

    const created = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "agent",
      phone: phone || "",
      address: address || undefined,
    });

    return res.status(201).json({
      agent: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role,
        status: created.status,
        phone: created.phone,
        address: created.address,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const role = String(req.query.role || "").trim();
    const status = String(req.query.status || "").trim();

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role && ALLOWED_USER_ROLES.has(role)) {
      query.role = role;
    }
    if (status && ALLOWED_USER_STATUSES.has(status)) {
      query.status = status;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "assignedAgentId", select: "name email profilePhoto phone bio status" });

    const userIds = users.map((user) => user._id);
    const [disputeCounts, latestScores] = await Promise.all([
      userIds.length
        ? Dispute.aggregate([
            { $match: { userId: { $in: userIds } } },
            { $group: { _id: "$userId", count: { $sum: 1 } } },
          ])
        : [],
      userIds.length
        ? CreditScore.aggregate([
            { $match: { userId: { $in: userIds } } },
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: { userId: "$userId", bureau: "$bureau" },
                doc: { $first: "$$ROOT" },
              },
            },
            {
              $group: {
                _id: "$_id.userId",
                latestScoresByBureau: { $push: "$doc" },
              },
            },
          ])
        : [],
    ]);

    const disputeCountByUser = disputeCounts.reduce((acc, row) => {
      acc[row._id.toString()] = row.count;
      return acc;
    }, {});
    const latestScoresByUser = latestScores.reduce((acc, row) => {
      acc[row._id.toString()] = row.latestScoresByBureau;
      return acc;
    }, {});

    return res.json({
      users: users.map((user) =>
        toManagedUserPayload(user, {
          latestScoresByBureau: latestScoresByUser[user._id.toString()] || [],
          disputeCount: disputeCountByUser[user._id.toString()] || 0,
        }),
      ),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const user = await getManagedUser(userId);
    if (!user) {
      return res.status(404).json({
        error: "NotFound",
        message: "User not found",
      });
    }

    const snapshot = await getUserDataSnapshot(user._id);

    return res.json({
      user: toManagedUserPayload(user, {
        latestScoresByBureau: snapshot.latestScoresByBureau,
        disputeCount: snapshot.disputeCount,
      }),
      accountSummary: snapshot.accountSummary,
      accounts: snapshot.accounts,
      scores: snapshot.scores,
      disputes: snapshot.disputes,
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "NotFound",
        message: "User not found",
      });
    }

    const previousAgentId = user.assignedAgentId?.toString() || null;

    const errors = await applyManagedUserPatch({
      actorId: req.user._id,
      targetUser: user,
      patch: req.body || {},
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: errors.join("; "),
      });
    }

    await user.save();

    const nextAgentId = user.assignedAgentId?.toString() || null;
    if (user.role === "user" && nextAgentId && nextAgentId !== previousAgentId) {
      await ensureAgentAssignmentRequest({
        user,
        agentId: user.assignedAgentId,
        serviceType: user.selectedService,
        source: "admin_assigned",
      });
    }

    const refreshedUser = await getManagedUser(user._id);
    const snapshot = await getUserDataSnapshot(user._id);

    return res.json({
      user: toManagedUserPayload(refreshedUser, {
        latestScoresByBureau: snapshot.latestScoresByBureau,
        disputeCount: snapshot.disputeCount,
      }),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/support-tickets", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const priority = String(req.query.priority || "").trim();
    const limit = parseLimit(req.query.limit);
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status && ALLOWED_SUPPORT_STATUSES.has(status)) {
      query.status = status;
    }
    if (priority && ALLOWED_SUPPORT_PRIORITIES.has(priority)) {
      query.priority = priority;
    }

    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ tickets });
  } catch (error) {
    return next(error);
  }
});

router.patch("/support-tickets/:ticketId", async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    if (!requireObjectIdParam(res, ticketId, "ticketId")) {
      return;
    }

    const updates = {};
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "status")) {
      const status = String(req.body.status || "");
      if (!ALLOWED_SUPPORT_STATUSES.has(status)) {
        return res.status(400).json({
          error: "ValidationError",
          message: "Invalid support ticket status",
        });
      }
      updates.status = status;
    }
    if (Object.prototype.hasOwnProperty.call(req.body || {}, "priority")) {
      const priority = String(req.body.priority || "");
      if (!ALLOWED_SUPPORT_PRIORITIES.has(priority)) {
        return res.status(400).json({
          error: "ValidationError",
          message: "Invalid support ticket priority",
        });
      }
      updates.priority = priority;
    }

    const ticket = await SupportTicket.findByIdAndUpdate(ticketId, updates, { new: true });
    if (!ticket) {
      return res.status(404).json({
        error: "NotFound",
        message: "Support ticket not found",
      });
    }

    return res.json({ ticket });
  } catch (error) {
    return next(error);
  }
});

router.get("/contact-messages", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const limit = parseLimit(req.query.limit);
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }
    if (status && ALLOWED_CONTACT_STATUSES.has(status)) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
});

router.patch("/contact-messages/:messageId", async (req, res, next) => {
  try {
    const { messageId } = req.params;
    if (!requireObjectIdParam(res, messageId, "messageId")) {
      return;
    }

    const status = String(req.body?.status || "");
    if (!ALLOWED_CONTACT_STATUSES.has(status)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid contact message status",
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(messageId, { status }, { new: true });
    if (!message) {
      return res.status(404).json({
        error: "NotFound",
        message: "Contact message not found",
      });
    }

    return res.json({ message });
  } catch (error) {
    return next(error);
  }
});

router.get("/consultations", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const limit = parseLimit(req.query.limit);
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }
    if (status && ALLOWED_CONSULTATION_STATUSES.has(status)) {
      query.status = status;
    }

    const consultations = await ConsultationRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return res.json({ consultations });
  } catch (error) {
    return next(error);
  }
});

router.patch("/consultations/:consultationId", async (req, res, next) => {
  try {
    const { consultationId } = req.params;
    if (!requireObjectIdParam(res, consultationId, "consultationId")) {
      return;
    }

    const status = String(req.body?.status || "");
    if (!ALLOWED_CONSULTATION_STATUSES.has(status)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid consultation status",
      });
    }

    const consultation = await ConsultationRequest.findByIdAndUpdate(
      consultationId,
      { status },
      { new: true },
    );
    if (!consultation) {
      return res.status(404).json({
        error: "NotFound",
        message: "Consultation request not found",
      });
    }

    return res.json({ consultation });
  } catch (error) {
    return next(error);
  }
});

router.get("/users/:userId/credit/accounts", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const accounts = await CreditAccount.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ accounts });
  } catch (error) {
    return next(error);
  }
});

router.post("/users/:userId/credit/accounts", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const {
      accountName,
      accountType,
      creditorName,
      balance,
      creditLimit,
      paymentHistory,
      lastPaymentDate,
      accountStatus,
      bureauExperian,
      bureauEquifax,
      bureauTransunion,
    } = req.body || {};

    if (!accountName || !accountType || !creditorName) {
      return res.status(400).json({
        error: "ValidationError",
        message: "accountName, accountType and creditorName are required",
      });
    }
    if (!ALLOWED_ACCOUNT_TYPES.has(String(accountType))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountType",
      });
    }
    if (accountStatus && !ALLOWED_ACCOUNT_STATUSES.has(String(accountStatus))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountStatus",
      });
    }

    const account = await CreditAccount.create({
      userId,
      accountName,
      accountType,
      creditorName,
      balance: Number(balance || 0),
      creditLimit: creditLimit ?? null,
      paymentHistory: paymentHistory || "",
      lastPaymentDate: lastPaymentDate || null,
      accountStatus: accountStatus || "open",
      bureauExperian: bureauExperian ?? true,
      bureauEquifax: bureauEquifax ?? true,
      bureauTransunion: bureauTransunion ?? true,
    });

    return res.status(201).json({ account });
  } catch (error) {
    return next(error);
  }
});

router.patch("/users/:userId/credit/accounts/:accountId", async (req, res, next) => {
  try {
    const { userId, accountId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, accountId, "accountId")
    ) {
      return;
    }

    if (
      req.body?.accountType !== undefined &&
      !ALLOWED_ACCOUNT_TYPES.has(String(req.body.accountType))
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountType",
      });
    }
    if (
      req.body?.accountStatus !== undefined &&
      !ALLOWED_ACCOUNT_STATUSES.has(String(req.body.accountStatus))
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountStatus",
      });
    }

    const account = await CreditAccount.findOneAndUpdate(
      { _id: accountId, userId },
      req.body || {},
      { new: true },
    );
    if (!account) {
      return res.status(404).json({
        error: "NotFound",
        message: "Credit account not found",
      });
    }

    return res.json({ account });
  } catch (error) {
    return next(error);
  }
});

router.delete("/users/:userId/credit/accounts/:accountId", async (req, res, next) => {
  try {
    const { userId, accountId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, accountId, "accountId")
    ) {
      return;
    }

    const account = await CreditAccount.findOneAndDelete({ _id: accountId, userId });
    if (!account) {
      return res.status(404).json({
        error: "NotFound",
        message: "Credit account not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/users/:userId/credit/scores", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const scores = await CreditScore.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ scores });
  } catch (error) {
    return next(error);
  }
});

router.post("/users/:userId/credit/scores", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const { bureau, score, utilizationRate, paymentHistoryScore, creditAge, scoreFactors } =
      req.body || {};

    if (!bureau || score === undefined) {
      return res.status(400).json({
        error: "ValidationError",
        message: "bureau and score are required",
      });
    }
    if (!ALLOWED_BUREAUS.has(String(bureau))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid bureau",
      });
    }

    const created = await CreditScore.create({
      userId,
      bureau,
      score,
      utilizationRate: utilizationRate ?? null,
      paymentHistoryScore: paymentHistoryScore ?? null,
      creditAge: creditAge ?? null,
      scoreFactors: scoreFactors ?? null,
    });

    return res.status(201).json({ score: created });
  } catch (error) {
    return next(error);
  }
});

router.patch("/users/:userId/credit/scores/:scoreId", async (req, res, next) => {
  try {
    const { userId, scoreId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, scoreId, "scoreId")
    ) {
      return;
    }

    if (req.body?.bureau !== undefined && !ALLOWED_BUREAUS.has(String(req.body.bureau))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid bureau",
      });
    }

    const score = await CreditScore.findOneAndUpdate(
      { _id: scoreId, userId },
      req.body || {},
      { new: true },
    );
    if (!score) {
      return res.status(404).json({
        error: "NotFound",
        message: "Credit score not found",
      });
    }

    return res.json({ score });
  } catch (error) {
    return next(error);
  }
});

router.delete("/users/:userId/credit/scores/:scoreId", async (req, res, next) => {
  try {
    const { userId, scoreId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, scoreId, "scoreId")
    ) {
      return;
    }

    const score = await CreditScore.findOneAndDelete({ _id: scoreId, userId });
    if (!score) {
      return res.status(404).json({
        error: "NotFound",
        message: "Credit score not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/users/:userId/disputes", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const disputes = await Dispute.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json({ disputes });
  } catch (error) {
    return next(error);
  }
});

router.post("/users/:userId/disputes", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!requireObjectIdParam(res, userId, "userId")) {
      return;
    }

    const { accountId, disputeReason, bureau, status, priority, resolutionNotes, documents } =
      req.body || {};

    if (!disputeReason || !bureau) {
      return res.status(400).json({
        error: "ValidationError",
        message: "disputeReason and bureau are required",
      });
    }
    if (!ALLOWED_DISPUTE_BUREAUS.has(String(bureau))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid bureau",
      });
    }
    if (status && !ALLOWED_DISPUTE_STATUSES.has(String(status))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid dispute status",
      });
    }
    if (priority && !ALLOWED_DISPUTE_PRIORITIES.has(String(priority))) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid dispute priority",
      });
    }
    if (accountId && !isValidObjectId(accountId)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountId",
      });
    }

    const dispute = await Dispute.create({
      userId,
      accountId: accountId || null,
      disputeReason,
      bureau,
      status: status || "pending",
      priority: priority || "medium",
      resolutionNotes: resolutionNotes || "",
      documents: Array.isArray(documents) ? documents : [],
    });

    return res.status(201).json({ dispute });
  } catch (error) {
    return next(error);
  }
});

router.patch("/users/:userId/disputes/:disputeId", async (req, res, next) => {
  try {
    const { userId, disputeId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, disputeId, "disputeId")
    ) {
      return;
    }

    if (
      req.body?.bureau !== undefined &&
      !ALLOWED_DISPUTE_BUREAUS.has(String(req.body.bureau))
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid bureau",
      });
    }
    if (
      req.body?.status !== undefined &&
      !ALLOWED_DISPUTE_STATUSES.has(String(req.body.status))
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid dispute status",
      });
    }
    if (
      req.body?.priority !== undefined &&
      !ALLOWED_DISPUTE_PRIORITIES.has(String(req.body.priority))
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid dispute priority",
      });
    }
    if (
      req.body?.accountId !== undefined &&
      req.body.accountId !== null &&
      req.body.accountId !== "" &&
      !isValidObjectId(req.body.accountId)
    ) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid accountId",
      });
    }

    const dispute = await Dispute.findOneAndUpdate(
      { _id: disputeId, userId },
      req.body || {},
      { new: true },
    );
    if (!dispute) {
      return res.status(404).json({
        error: "NotFound",
        message: "Dispute not found",
      });
    }

    return res.json({ dispute });
  } catch (error) {
    return next(error);
  }
});

router.delete("/users/:userId/disputes/:disputeId", async (req, res, next) => {
  try {
    const { userId, disputeId } = req.params;
    if (
      !requireObjectIdParam(res, userId, "userId") ||
      !requireObjectIdParam(res, disputeId, "disputeId")
    ) {
      return;
    }

    const dispute = await Dispute.findOneAndDelete({ _id: disputeId, userId });
    if (!dispute) {
      return res.status(404).json({
        error: "NotFound",
        message: "Dispute not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.get("/dashboard", async (_req, res, next) => {
  try {
    const months = buildMonthBuckets(6);

    const [
      roleCounts,
      disputeStatusCounts,
      supportStatusCounts,
      supportPriorityCounts,
      consultationStatusCounts,
      monthlyUserCounts,
      monthlyDisputeCounts,
      monthlyConsultationCounts,
      recentUsers,
      agents,
      assignedUsers,
      recentAppointments,
    ] = await Promise.all([
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Dispute.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      SupportTicket.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      SupportTicket.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      ConsultationRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      aggregateMonthlyCounts(User, months),
      aggregateMonthlyCounts(Dispute, months),
      aggregateMonthlyCounts(ConsultationRequest, months),
      User.find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .select("name email role createdAt")
        .lean(),
      User.find({ role: "agent" })
        .sort({ createdAt: -1 })
        .select("name email status createdAt")
        .lean(),
      User.find({ role: "user", assignedAgentId: { $ne: null } })
        .select("name email status selectedService activePlan assignedAgentId createdAt")
        .lean(),
      ConsultationRequest.find({ "schedule.date": { $ne: "" } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    const recentUserIds = recentUsers.map((user) => user._id);
    const recentUserDisputes =
      recentUserIds.length > 0
        ? await Dispute.aggregate([
            { $match: { userId: { $in: recentUserIds } } },
            { $group: { _id: "$userId", count: { $sum: 1 } } },
          ])
        : [];

    const disputesByRecentUser = recentUserDisputes.reduce((acc, row) => {
      acc[row._id.toString()] = row.count;
      return acc;
    }, {});

    const totalUsers = getCount(roleCounts, "user");
    const activeAgents = getCount(roleCounts, "agent");
    const pendingDisputes =
      getCount(disputeStatusCounts, "pending") +
      getCount(disputeStatusCounts, "investigating");
    const openSupportTickets =
      getCount(supportStatusCounts, "open") +
      getCount(supportStatusCounts, "in-progress") +
      getCount(supportStatusCounts, "waiting");
    const pendingCases = pendingDisputes + openSupportTickets;

    const resolvedCases =
      getCount(disputeStatusCounts, "resolved") +
      getCount(supportStatusCounts, "resolved") +
      getCount(supportStatusCounts, "closed");
    const totalCaseVolume =
      disputeStatusCounts.reduce((sum, row) => sum + row.count, 0) +
      supportStatusCounts.reduce((sum, row) => sum + row.count, 0);
    const systemHealth =
      totalCaseVolume > 0
        ? Number(((resolvedCases / totalCaseVolume) * 100).toFixed(1))
        : 100;

    const monthlyTrend = months.map((month) => ({
      month: month.label,
      users: monthlyUserCounts[month.key] || 0,
      disputes: monthlyDisputeCounts[month.key] || 0,
      consultations: monthlyConsultationCounts[month.key] || 0,
    }));

    const usersThisMonth = monthlyTrend[monthlyTrend.length - 1]?.users || 0;
    const usersLastMonth = monthlyTrend[monthlyTrend.length - 2]?.users || 0;
    const highPriorityTickets =
      getCount(supportPriorityCounts, "high") + getCount(supportPriorityCounts, "urgent");
    const newConsultations = getCount(consultationStatusCounts, "new");

    const systemAlerts = [];

    if (highPriorityTickets > 0) {
      systemAlerts.push({
        type: "error",
        severity: "high",
        message: `${highPriorityTickets} high-priority support tickets require attention`,
        timestamp: "Updated just now",
      });
    }

    if (pendingCases > 0) {
      systemAlerts.push({
        type: "warning",
        severity: pendingCases > 25 ? "high" : "medium",
        message: `${pendingCases} open cases are currently waiting on resolution`,
        timestamp: "Updated just now",
      });
    }

    if (usersThisMonth > usersLastMonth) {
      systemAlerts.push({
        type: "success",
        severity: "low",
        message: "User growth increased compared to last month",
        timestamp: "Updated just now",
      });
    }

    if (newConsultations > 0) {
      systemAlerts.push({
        type: "info",
        severity: "low",
        message: `${newConsultations} new consultation requests are awaiting follow-up`,
        timestamp: "Updated just now",
      });
    }

    if (systemAlerts.length === 0) {
      systemAlerts.push({
        type: "success",
        severity: "low",
        message: "No outstanding platform alerts right now",
        timestamp: "Updated just now",
      });
    }

    const recentUsersData = recentUsers.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt,
      disputeCount: disputesByRecentUser[user._id.toString()] || 0,
    }));

    const assignedUserEmails = assignedUsers.map((user) => user.email).filter(Boolean);
    const assignedAppointments =
      assignedUserEmails.length > 0
        ? await ConsultationRequest.find({ email: { $in: assignedUserEmails } })
            .sort({ createdAt: -1 })
            .lean()
        : [];

    const latestAppointmentByEmail = new Map();
    for (const appointment of assignedAppointments) {
      if (!latestAppointmentByEmail.has(appointment.email)) {
        latestAppointmentByEmail.set(appointment.email, appointment);
      }
    }

    const agentPortfolios = agents.map((agent) => {
      const clients = assignedUsers
        .filter((user) => user.assignedAgentId?.toString() === agent._id.toString())
        .map((user) => {
          const appointment = latestAppointmentByEmail.get(user.email) || null;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            status: user.status,
            selectedService: user.selectedService || null,
            activePlan: normalizeActivePlan(user.activePlan),
            latestAppointment: appointment ? toAppointmentPayload(appointment) : null,
            joinedAt: user.createdAt,
          };
        });

      return {
        id: agent._id.toString(),
        name: agent.name,
        email: agent.email,
        status: agent.status,
        clientCount: clients.length,
        activePlanCount: clients.filter((client) => client.activePlan.name).length,
        clients,
      };
    });

    res.json({
      summary: {
        totalUsers,
        activeAgents,
        pendingCases,
        openSupportTickets,
        systemHealth,
        newUsersThisMonth: usersThisMonth,
      },
      systemOverview: [
        { name: "Active Users", value: totalUsers },
        { name: "Active Agents", value: activeAgents },
        { name: "Pending Cases", value: pendingCases },
      ],
      caseBreakdown: [
        { name: "Pending", value: getCount(disputeStatusCounts, "pending") },
        { name: "Investigating", value: getCount(disputeStatusCounts, "investigating") },
        { name: "Resolved", value: getCount(disputeStatusCounts, "resolved") },
        { name: "Rejected", value: getCount(disputeStatusCounts, "rejected") },
      ],
      monthlyTrend,
      recentUsers: recentUsersData,
      agentPortfolios,
      appointments: recentAppointments.map(toAppointmentPayload),
      systemAlerts,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/platform-controls", async (_req, res, next) => {
  try {
    const controls = await ensurePlatformControl();
    res.json(toPlatformControlPayload(controls));
  } catch (error) {
    next(error);
  }
});

router.patch("/platform-controls", async (req, res, next) => {
  try {
    const controls = await ensurePlatformControl();
    const patch = req.body || {};
    const errors = applyPlatformControlPatch(controls, patch);

    if (errors.length > 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: errors.join("; "),
      });
    }

    controls.updatedBy = req.user._id;
    await controls.save();

    return res.json(toPlatformControlPayload(controls));
  } catch (error) {
    return next(error);
  }
});

export default router;
