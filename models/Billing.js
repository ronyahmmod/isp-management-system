import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    amount: { type: Number, required: true }, // monthly fee

    month: { type: String, required: true }, // "January 2025"
    year: { type: Number, required: true },

    status: {
      type: String,
      enum: ["paid", "unpaid", "due"],
      default: "unpaid",
    },

    paidAt: { type: Date },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // employee or admin
    },

    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.Billing ||
  mongoose.model("Billing", BillingSchema);
