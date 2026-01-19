import { connection, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Billing from "@/models/Billing";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requireEmployee } from "@/lib/requireEmployee";

export async function POST(req) {
  try {
    await requireEmployee();
    await connectDB();
    const session = await getServerSession(authOptions);

    const { billingId } = await req.json();

    const billing = await Billing.findById(billingId);
    if (!billing) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    const customer = await Customer.findById(billing.customer);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    if (billing.status === "paid") {
      return NextResponse.json(
        { error: "Billing already paid" },
        { status: 400 }
      );
    }

    billing.status = "paid";
    billing.paymentMethod = "cash";
    billing.paidAt = new Date();
    billing.collectedBy = session.user.id;
    await billing.save();

    if (customer) {
      await Customer.findByIdAndUpdate(customer._id, {
        dueAmount: customer.dueAmount - billing.amount,
        ConnectionStatus: "connected",
        status: "active",
      });
    }

    return NextResponse.json(
      { message: "Payment recorded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
