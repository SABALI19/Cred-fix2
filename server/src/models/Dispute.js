import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreditAccount",
      default: null,
    },
    disputeReason: { type: String, required: true, trim: true },
    bureau: {
      type: String,
      enum: ["experian", "equifax", "transunion", "all"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "rejected"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    resolutionNotes: { type: String, trim: true, default: "" },
    documents: {
      type: [
        {
          name: String,
          url: String,
          uploadedAt: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Dispute = mongoose.model("Dispute", disputeSchema);
