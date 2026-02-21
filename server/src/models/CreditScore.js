import mongoose from "mongoose";

const creditScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bureau: {
      type: String,
      enum: ["experian", "equifax", "transunion"],
      required: true,
    },
    score: { type: Number, required: true, min: 300, max: 850 },
    utilizationRate: { type: Number, min: 0, max: 10, default: null },
    paymentHistoryScore: { type: Number, min: 0, max: 100, default: null },
    creditAge: { type: Number, min: 0, default: null },
    scoreFactors: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const CreditScore = mongoose.model("CreditScore", creditScoreSchema);
