import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { signAuthToken } from "../utils/jwt.js";

const router = Router();

const toAuthPayload = (user) => ({
  user: user.toJSON(),
  token: signAuthToken({ sub: user._id.toString(), role: user.role }),
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

    return res.json(toAuthPayload(user));
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
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
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, (_req, res) => {
  res.status(204).send();
});

export default router;
