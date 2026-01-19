"use server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Billing from "@/models/Billing";
import Package from "@/models/Package";

export async function generateSingleBill(customerId) {
  try {
    await connectDB();
    const customer = await Customer.findById(customerId).populate("package");
    if (!customer) return { success: false, message: "Customer not found" };
    const billingDate = new Date(customer.nextBillingDate);

    const existBill = await Billing.findOne({
      customer: customer._id,
      month: billingDate.getMonth(),
      year: billingDate.getFullYear(),
    });

    if (existBill) return { success: false, message: "Bill already generated" };
    const amount = customer.package?.price || 0;

    // 1. Create the Bill
    await Billing.create({
      customer: customer._id,
      month: billingDate.getMonth(),
      year: billingDate.getFullYear(),
      amount,
      status: "unpaid",
    });

    const nextDate = new Date(billingDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    await Customer.findByIdAndUpdate(customer._id, {
      nextBillingDate: nextDate,
      connectionStatus: "barred",
      $inc: { dueAmount: amount },
    });

    return { success: true, message: "Bill generated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}
