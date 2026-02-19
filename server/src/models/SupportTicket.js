import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "waiting", "resolved", "closed"],
      default: "open",
    },
    attachments: {
      type: [
        {
          name: String,
          size: Number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
