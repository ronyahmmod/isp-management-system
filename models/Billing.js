import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, unique: true },

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

    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "nagad", "bank", "none"],
      default: "none",
    },

    paidAt: { type: Date },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // employee or admin
    },
    transactionId: { type: String }, // For future MFS integration

    note: String,
  },
  { timestamps: true }
);

BillingSchema.pre("save", function (next) {
  if (!this.invoiceId) {
    this.invoiceId = `INV-${Date.now()}`;
  }
  next();
});

export default mongoose.models.Billing ||
  mongoose.model("Billing", BillingSchema);
