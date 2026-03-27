import { Router } from "express";
import mongoose from "mongoose";
import { ConsultationRequest } from "../models/ConsultationRequest.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { ensureAgentAssignmentRequest } from "../utils/agentAssignment.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const consultations = await ConsultationRequest.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(consultations);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, message, serviceType, plan, agent, schedule } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name and email are required",
      });
    }

    const created = await ConsultationRequest.create({
      name,
      email,
      phone,
      message,
      serviceType: serviceType || null,
      plan: {
        name: plan?.name || "",
        price: plan?.price ?? null,
      },
      agent: {
        id: agent?.id || "",
        name: agent?.name || "",
        title: agent?.title || "",
      },
      schedule: {
        date: schedule?.date || "",
        time: schedule?.time || "",
        consultationType: schedule?.consultationType || "",
      },
    });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (user?.role === "user") {
      if (plan?.name) {
        user.activePlan = {
          name: String(plan.name),
          price: plan.price ?? null,
          serviceType: serviceType || "",
          startedAt: new Date(),
        };
      }

      const requestedAgentId = String(agent?.id || "").trim();
      const hasAssignedAgent = Boolean(user.assignedAgentId);
      const assignedAgentId = user.assignedAgentId?.toString() || null;

      if (serviceType && !user.selectedService) {
        user.selectedService = serviceType;
      }

      if (requestedAgentId && !hasAssignedAgent && mongoose.isValidObjectId(requestedAgentId)) {
        const bookedAgent = await User.findOne({
          _id: requestedAgentId,
          role: "agent",
          status: "active",
        })
          .select("_id")
          .lean();

        if (bookedAgent) {
          user.assignedAgentId = bookedAgent._id;
        }
      }

      await user.save();

      const nextAgentId = user.assignedAgentId?.toString() || null;
      const shouldCreateRequest =
        nextAgentId &&
        (nextAgentId === String(agent?.id || "").trim() || assignedAgentId !== nextAgentId);

      if (shouldCreateRequest) {
        await ensureAgentAssignmentRequest({
          user,
          agentId: user.assignedAgentId,
          serviceType: serviceType || user.selectedService,
          planName: plan?.name || "",
          source: "consultation_booked",
        });
      }
    }

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

export default router;
