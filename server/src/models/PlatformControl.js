import mongoose from "mongoose";

const chartControlSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const serviceControlSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    ctaLabel: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const platformControlSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "default",
      immutable: true,
    },
    charts: {
      creditScore: { type: chartControlSchema, default: () => ({}) },
      disputes: { type: chartControlSchema, default: () => ({}) },
      accountStatus: { type: chartControlSchema, default: () => ({}) },
      monthlyTrend: { type: chartControlSchema, default: () => ({}) },
      recentActivity: { type: chartControlSchema, default: () => ({}) },
    },
    services: {
      taxServices: {
        type: serviceControlSchema,
        default: () => ({
          title: "Tax Filing Services",
          description: "Maximize your refunds with professional tax preparation",
          ctaLabel: "Start Tax Filing",
        }),
      },
      creditScoreServices: {
        type: serviceControlSchema,
        default: () => ({
          title: "Credit Score Services",
          description: "Track and improve your credit score over time",
          ctaLabel: "View Credit Progress",
        }),
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export const PlatformControl = mongoose.model(
  "PlatformControl",
  platformControlSchema,
);
