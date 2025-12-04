import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    amount: { type: Number, required: true },

    method: {
      type: String,
      enum: ["bkash", "nagad", "cash", "bank"],
      required: true,
    },

    transactionId: { type: String },

    month: String,
    year: Number,

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
