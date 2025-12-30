import mongoose from "mongoose";

const SalarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // "December 2025"
    status: { type: String, enum: ["paid", "unpaid"], default: "paid" },
    paymentDate: { type: Date, default: Date.now },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Salary || mongoose.model("Salary", SalarySchema);
