import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    selectedService: {
      type: String,
      enum: ["credit_repair", "tax_services", "comprehensive"],
      default: null,
    },
    activePlan: {
      name: { type: String, trim: true, default: "" },
      price: { type: Number, default: null },
      serviceType: {
        type: String,
        enum: ["credit_repair", "tax_services", "comprehensive", ""],
        default: "",
      },
      startedAt: { type: Date, default: null },
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    profilePhoto: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: {
      streetAddress: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      zipCode: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
