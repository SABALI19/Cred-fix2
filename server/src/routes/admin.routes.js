import { Router } from "express";
import bcrypt from "bcryptjs";
import { ConsultationRequest } from "../models/ConsultationRequest.js";
import { Dispute } from "../models/Dispute.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";

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

router.use(requireAuth);
router.use((req, res, next) => {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Admin access required",
    });
  }
  return next();
});

router.get("/agents", async (_req, res, next) => {
  try {
    const agents = await User.find({ role: "agent" })
      .sort({ createdAt: -1 })
      .select("name email role phone createdAt updatedAt")
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
      systemAlerts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
