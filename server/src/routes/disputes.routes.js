import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.middleware.js";
import { Dispute } from "../models/Dispute.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const data = await Dispute.find({ userId: req.auth.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { accountId, disputeReason, bureau, status, priority, resolutionNotes } =
      req.body || {};

    if (!disputeReason || !bureau) {
      return res.status(400).json({
        error: "ValidationError",
        message: "disputeReason and bureau are required",
      });
    }

    const created = await Dispute.create({
      userId: req.auth.userId,
      accountId: accountId || null,
      disputeReason,
      bureau,
      status: status || "pending",
      priority: priority || "medium",
      resolutionNotes: resolutionNotes || "",
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ValidationError", message: "Invalid id" });
    }

    const updated = await Dispute.findOneAndUpdate(
      { _id: id, userId: req.auth.userId },
      req.body || {},
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ error: "NotFound", message: "Dispute not found" });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Dispute.findOneAndDelete({
      _id: id,
      userId: req.auth.userId,
    });
    if (!deleted) {
      return res.status(404).json({ error: "NotFound", message: "Dispute not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/stats/summary", async (req, res, next) => {
  try {
    const disputes = await Dispute.find({ userId: req.auth.userId }).lean();
    const total = disputes.length;
    const activeDisputes = disputes.filter((d) => d.status === "investigating").length;
    const pending = disputes.filter((d) => d.status === "pending").length;
    const resolved = disputes.filter((d) => d.status === "resolved").length;
    const rejected = disputes.filter((d) => d.status === "rejected").length;
    res.json({ total, activeDisputes, pending, resolved, rejected });
  } catch (error) {
    next(error);
  }
});

router.get("/stats/by-bureau", async (req, res, next) => {
  try {
    const rows = await Dispute.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.auth.userId) } },
      { $group: { _id: "$bureau", count: { $sum: 1 } } },
      { $project: { _id: 0, bureau: "$_id", count: 1 } },
    ]);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
