import mongoose from "mongoose";

const consultationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    serviceType: {
      type: String,
      enum: ["credit_repair", "tax_services", "comprehensive", null],
      default: null,
    },
    plan: {
      name: { type: String, trim: true, default: "" },
      price: { type: Number, default: null },
    },
    agent: {
      id: { type: String, trim: true, default: "" },
      name: { type: String, trim: true, default: "" },
      title: { type: String, trim: true, default: "" },
    },
    schedule: {
      date: { type: String, trim: true, default: "" },
      time: { type: String, trim: true, default: "" },
      consultationType: { type: String, trim: true, default: "" },
    },
    status: {
      type: String,
      enum: ["new", "contacted", "booked", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export const ConsultationRequest = mongoose.model(
  "ConsultationRequest",
  consultationRequestSchema,
);
