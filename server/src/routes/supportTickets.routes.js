import { Router } from "express";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";
import { SupportTicket } from "../models/SupportTicket.js";

const router = Router();

router.post("/", optionalAuth, async (req, res, next) => {
  try {
    const { name, email, subject, description, category, priority, attachments } =
      req.body || {};

    if (!name || !email || !subject || !description || !category) {
      return res.status(400).json({
        error: "ValidationError",
        message: "name, email, subject, description and category are required",
      });
    }

    const created = await SupportTicket.create({
      userId: req.auth?.userId || null,
      name,
      email,
      subject,
      description,
      category,
      priority: priority || "medium",
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const query = {};

    if (req.auth?.userId) {
      query.userId = req.auth.userId;
    } else if (req.query.email) {
      query.email = String(req.query.email).toLowerCase();
    }

    const data = await SupportTicket.find(query).sort({ createdAt: -1 }).limit(200).lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
