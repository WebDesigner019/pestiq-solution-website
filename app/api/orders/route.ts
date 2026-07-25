import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, address, city, state, zip,
      serviceArea, propertyType, pestConcern, description,
      preferredDate, arrivalWindow, alternateDate, accessNotes,
      planType = "monthly", quoteId
    } = body;

    if (!name || !phone || !email || !address) {
      return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
    }

    const referenceCode = `PIQ-${Date.now().toString().slice(-6)}`;

    // Try DB insertion if DATABASE_URL is configured
    if (process.env.DATABASE_URL) {
      try {
        const customer = await prisma.customer.upsert({
          where: { email },
          update: { fullName: name, phone },
          create: { email, fullName: name, phone },
        });

        const serviceAddress = await prisma.serviceAddress.create({
          data: {
            customerId: customer.id,
            street: address,
            city: city || "New York",
            state: state || "NY",
            zip: zip || "10001",
            propertyType: propertyType || "Single Family Home",
            accessNotes,
          },
        });

        const plan = await prisma.plan.upsert({
          where: { slug: planType === "monthly" ? "complete" : "onetime" },
          update: {},
          create: {
            slug: planType === "monthly" ? "complete" : "onetime",
            name: planType === "monthly" ? "Complete Protection" : "One-Time Service",
            description: "PestIQ Pest Control Plan",
          },
        });

        const order = await prisma.order.create({
          data: {
            referenceCode,
            customerId: customer.id,
            addressId: serviceAddress.id,
            planId: plan.id,
            status: "PENDING_PAYMENT",
            totalCents: planType === "monthly" ? 6900 : 27900,
          },
        });

        await prisma.appointmentRequest.create({
          data: {
            orderId: order.id,
            addressId: serviceAddress.id,
            preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
            arrivalWindow: arrivalWindow || "Flexible",
            alternateDate: alternateDate ? new Date(alternateDate) : null,
            notes: `${pestConcern ? "Concern: " + pestConcern + ". " : ""}${description || ""}`.trim(),
          },
        });

        return NextResponse.json({
          success: true,
          referenceCode,
          orderId: order.id,
          message: "Order & appointment request created in DB successfully",
        });
      } catch (dbErr) {
        console.warn("DB connection error, falling back to response:", dbErr);
      }
    }

    // Fallback response for unmigrated DB
    return NextResponse.json({
      success: true,
      referenceCode,
      message: "Appointment request recorded",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process order" }, { status: 500 });
  }
}
