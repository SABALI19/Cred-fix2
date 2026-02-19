import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["new", "in-review", "resolved", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema,
);
