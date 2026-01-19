import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Billing from "@/models/Billing";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
