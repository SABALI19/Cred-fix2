import { Router } from "express";
import { ContactMessage } from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body || {};

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        error: "ValidationError",
        message: "firstName, lastName, email and message are required",
      });
    }

    const created = await ContactMessage.create({
      firstName,
      lastName,
      email,
      phone: phone || "",
      subject: subject || "",
      message,
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
