import mongoose from "mongoose";

const consultationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
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
