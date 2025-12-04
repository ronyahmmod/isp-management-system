import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },

    address: { type: String, required: true },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    connectionType: {
      type: String,
      enum: ["PPPoE", "Hotspot", "Static", "Cable"],
      required: true,
    },

    username: { type: String }, // PPPoE or system username
    password: { type: String }, // PPPoE system password

    status: { type: String, enum: ["active", "inactive"], default: "active" },

    // Auto billing date
    nextBillingDate: { type: Date, required: true },

    // Balance
    dueAmount: { type: Number, default: 0 },

    // For reports
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
