import { Router } from "express";
import { ConsultationRequest } from "../models/ConsultationRequest.js";
import { CreditScore } from "../models/CreditScore.js";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

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

router.use(requireAuth);

router.get("/dashboard", async (req, res, next) => {
  try {
    if (req.auth?.role !== "agent" && req.auth?.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only agents and admins can access this endpoint",
      });
    }

    const clients = await User.find({
      role: "user",
      assignedAgentId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .select("name email phone status selectedService activePlan createdAt")
      .lean();

    const clientIds = clients.map((client) => client._id);
    const clientEmails = clients.map((client) => client.email).filter(Boolean);

    const [latestScores, appointments] = await Promise.all([
      clientIds.length > 0
        ? CreditScore.aggregate([
            { $match: { userId: { $in: clientIds } } },
            { $sort: { createdAt: -1 } },
            {
              $group: {
                _id: "$userId",
                score: { $first: "$score" },
                bureau: { $first: "$bureau" },
                updatedAt: { $first: "$createdAt" },
              },
            },
          ])
        : [],
      clientEmails.length > 0
        ? ConsultationRequest.find({ email: { $in: clientEmails } })
            .sort({ createdAt: -1 })
            .lean()
        : [],
    ]);

    const latestScoreByUserId = latestScores.reduce((acc, row) => {
      acc[row._id.toString()] = {
        score: row.score,
        bureau: row.bureau,
        updatedAt: row.updatedAt,
      };
      return acc;
    }, {});

    const latestAppointmentByEmail = new Map();
    for (const appointment of appointments) {
      if (!latestAppointmentByEmail.has(appointment.email)) {
        latestAppointmentByEmail.set(appointment.email, appointment);
      }
    }

    const clientRows = clients.map((client) => {
      const latestScore = latestScoreByUserId[client._id.toString()] || null;
      const latestAppointment = latestAppointmentByEmail.get(client.email) || null;

      return {
        id: client._id.toString(),
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        status: client.status,
        selectedService: client.selectedService || null,
        activePlan: normalizeActivePlan(client.activePlan),
        latestScore,
        latestAppointment: latestAppointment ? toAppointmentPayload(latestAppointment) : null,
        createdAt: client.createdAt,
      };
    });

    return res.json({
      summary: {
        totalClients: clientRows.length,
        clientsWithActivePlans: clientRows.filter((client) => client.activePlan.name).length,
        scheduledAppointments: appointments.filter((item) => item.schedule?.date).length,
      },
      clients: clientRows,
      appointments: appointments.map(toAppointmentPayload),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
