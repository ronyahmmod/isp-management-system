import ReactPDF from "@react-pdf/renderer";
import BillingPDF from "@/app/components/BillingPDF";
import Billing from "@/models/Billing";
import Customer from "@/models/Customer";
import Package from "@/models/Package";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { requireEmployee } from "@/lib/requireEmployee";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  try {
    requireEmployee();
    await connectDB();
    const { id } = await params;
    const billing = await Billing.findById(id).populate(
      "customer package collectedBy"
    );
    console.log(billing);
    // Render the React component to a Node stream
    const stream = await ReactPDF.renderToStream(<BillingPDF data={billing} />);

    // Set the response headers for PDF
    return new Response(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="billing_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
