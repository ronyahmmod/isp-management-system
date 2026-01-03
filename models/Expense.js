import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Office Rent",
        "Utility",
        "Marketing",
        "Hardware",
        "Salary",
        "Other",
      ],
      required: true,
    },
    status: { type: String, enum: [], default: "approved" },
    editRequest: {
      requestedAmount: Number,
      requestedTitle: String,
      reason: String,
      isEditPending: { type: Boolean, default: false },
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
