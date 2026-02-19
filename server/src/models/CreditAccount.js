import mongoose from "mongoose";

const creditAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountName: { type: String, required: true, trim: true },
    accountType: {
      type: String,
      enum: [
        "credit_card",
        "auto_loan",
        "mortgage",
        "personal_loan",
        "student_loan",
        "other",
      ],
      required: true,
    },
    creditorName: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, min: 0 },
    creditLimit: { type: Number, min: 0, default: null },
    paymentHistory: { type: String, trim: true, default: "" },
    lastPaymentDate: { type: Date, default: null },
    accountStatus: {
      type: String,
      enum: ["open", "closed", "dispute"],
      default: "open",
    },
    bureauExperian: { type: Boolean, default: true },
    bureauEquifax: { type: Boolean, default: true },
    bureauTransunion: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CreditAccount = mongoose.model("CreditAccount", creditAccountSchema);
