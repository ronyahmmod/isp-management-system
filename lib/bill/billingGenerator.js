"use server";

import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Billing from "@/models/Billing";
import Package from "@/models/Package";
import { requireEmployee } from "../requireEmployee";
import { NextResponse } from "next/server";

export async function generateMonthlyBilling() {
  try {
    requireEmployee();
    await connectDB();
    const now = new Date();

    const customers = await Customer.find({
      status: "active",
      nextBillingDate: {
        $lte: now,
      },
    }).populate("package");
    let count = 0;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (const customer of customers) {
      const billingDate = new Date(customer.nextBillingDate);
      const billingMonthStr = `${
        monthNames[billingDate.getMonth()]
      } ${billingDate.getFullYear()}`;
      const billingYear = billingDate.getFullYear();

      const exists = await Billing.findOne({
        customer: customer._id,
        month: billingMonthStr,
        year: billingYear,
      });
      if (exists) continue;
      const amount = customer.package?.price || 0;

      await Billing.create({
        customer: customer._id,
        package: customer.package?._id,
        month: billingMonthStr,
        year: billingYear,
        amount,
        status: "unpaid",
      });
      const nextDate = new Date(billingDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      await Customer.findByIdAndUpdate(customer._id, {
        nextBillingDate: nextDate,
        $inc: { dueAmount: customer.package?.price || 0 }, // This ADDS to the existing due
      });
      count++;
    }

    return NextResponse.json(
      {
        message: "Billing generated successfully",
        total: customers.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function generateManualSingleBill(customerId) {
  try {
    requireEmployee();
    await connectDB();
    const customer = await Customer.findById(customerId).populate("package");

    if (!customer) {
      return { success: false, message: "Customer not found" };
    }
    const billingDate = new Date(customer.nextBillingDate);
    const existBill = await Billing.findOne({
      customer: customerId._id,
      month: billingDate.getMonth(),
      year: billingDate.getFullYear(),
    });

    if (existBill) {
      return { success: false, message: "Bill already generated" };
    }

    const amount = customer.package?.price || 0;

    const bill = await Billing.create({
      customer: customer._id,
      package: customer.package?._id,
      month: billingDate.getMonth(),
      year: billingDate.getFullYear(),
      amount,
      status: "unpaid",
    });

    const nextDate = new Date(billingDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    await Customer.findByIdAndUpdate(customer._id, {
      nextBillingDate: nextDate,
      $inc: { dueAmount: customer.package?.price || 0 }, // This ADDS to the existing due
    });
    return {
      success: true,
      message: "Bill generated successfully",
      bill: JSON.parse(JSON.stringify(bill)), // Strips Mongoose prototypes
    };
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
