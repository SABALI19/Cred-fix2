import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.middleware.js";
import { CreditAccount } from "../models/CreditAccount.js";
import { CreditScore } from "../models/CreditScore.js";

const router = Router();

router.use(requireAuth);

router.get("/accounts", async (req, res, next) => {
  try {
    const data = await CreditAccount.find({ userId: req.auth.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/accounts", async (req, res, next) => {
  try {
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

    const created = await CreditAccount.create({
      userId: req.auth.userId,
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

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.patch("/accounts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ValidationError", message: "Invalid id" });
    }

    const updated = await CreditAccount.findOneAndUpdate(
      { _id: id, userId: req.auth.userId },
      req.body || {},
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "NotFound", message: "Account not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/accounts/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CreditAccount.findOneAndDelete({
      _id: id,
      userId: req.auth.userId,
    });
    if (!deleted) {
      return res.status(404).json({ error: "NotFound", message: "Account not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/scores", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 100);
    const data = await CreditScore.find({ userId: req.auth.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/scores", async (req, res, next) => {
  try {
    const { bureau, score, utilizationRate, paymentHistoryScore, creditAge, scoreFactors } =
      req.body || {};
    if (!bureau || score === undefined) {
      return res
        .status(400)
        .json({ error: "ValidationError", message: "bureau and score are required" });
    }
    const created = await CreditScore.create({
      userId: req.auth.userId,
      bureau,
      score,
      utilizationRate: utilizationRate ?? null,
      paymentHistoryScore: paymentHistoryScore ?? null,
      creditAge: creditAge ?? null,
      scoreFactors: scoreFactors ?? null,
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.get("/scores/latest", async (req, res, next) => {
  try {
    const data = await CreditScore.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.auth.userId) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$bureau",
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/summary", async (req, res, next) => {
  try {
    const accounts = await CreditAccount.find({ userId: req.auth.userId }).lean();
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    const totalLimit = accounts.reduce((sum, a) => sum + (a.creditLimit || 0), 0);
    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
    res.json({
      totalAccounts,
      totalBalance,
      totalLimit,
      utilization,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
