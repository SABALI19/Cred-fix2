import { Router } from "express";
import { ConsultationRequest } from "../models/ConsultationRequest.js";

const router = Router();

router.get("/", async (_req, res, next) => {
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
    const { name, email, phone, message } = req.body || {};

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
    });

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

export default router;
