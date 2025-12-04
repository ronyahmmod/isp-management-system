import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    speed: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "weekly", "daily", "yearly"],
      default: "monthly",
    },
    validityDays: { type: Number, default: 30 },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Package ||
  mongoose.model("Package", PackageSchema);
