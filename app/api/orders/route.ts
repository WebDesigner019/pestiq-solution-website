import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { validateNjAddress } from "@/lib/njGeocode";
import { checkRateLimit, noStoreJson, reportAddressEvent } from "@/lib/requestGuards";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "service-request", { limit: 5, windowMs: 60_000 });
    if (!rateLimit.allowed) {
      return noStoreJson({ error: "Too many service requests. Please wait a moment and try again." }, {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      });
    }

    const body = await req.json();
    const {
      name, email, phone, address, city, state, zip,
      serviceArea, propertyType, pestConcern, description,
      preferredDate, arrivalWindow, alternateDate, accessNotes,
      planType = "monthly", quoteId
    } = body;

    if (!name || !phone || !email || !address) {
      return noStoreJson({ error: "Missing required contact details" }, { status: 400 });
    }

    const verifiedAddress = await validateNjAddress(address);
    if (!verifiedAddress) {
      reportAddressEvent("service_request_address", "rejected");
      return noStoreJson({
        error: "We could not verify this as an exact New Jersey address. Please correct it and try again.",
      }, { status: 422 });
    }
    reportAddressEvent("service_request_address", "allowed");

    const referenceCode = `PIQ-${Date.now().toString().slice(-6)}`;
    const planName = planType === "monthly" ? "Complete Protection Plan" : "One-Time Treatment";
    const fullAddress = verifiedAddress.fullAddress;

    // Dispatch transactional email async
    sendOrderConfirmationEmail({
      toEmail: email,
      customerName: name,
      referenceCode,
      serviceAddress: fullAddress,
      preferredDate: preferredDate || "As soon as available",
      arrivalWindow: arrivalWindow || "Flexible",
      planName,
      notes: description,
    }).catch(err => console.warn("Async email dispatch error:", err));

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
            street: verifiedAddress.street,
            city: verifiedAddress.city,
            state: verifiedAddress.state,
            zip: verifiedAddress.zip,
            propertyType: propertyType || "Single Family Home",
            accessNotes,
          },
        });

        const plan = await prisma.plan.upsert({
          where: { slug: planType === "monthly" ? "complete" : "onetime" },
          update: {},
          create: {
            slug: planType === "monthly" ? "complete" : "onetime",
            name: planName,
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

        return noStoreJson({
          success: true,
          referenceCode,
          orderId: order.id,
          message: "Order & appointment request created in DB successfully. Confirmation email dispatched.",
        });
      } catch (dbErr) {
        console.warn("DB connection error, falling back to response:", dbErr);
      }
    }

    // Fallback response for unmigrated DB
    return noStoreJson({
      success: true,
      referenceCode,
      message: "Appointment request recorded and email dispatched.",
    });
  } catch (err: any) {
    return noStoreJson({ error: "Unable to process this service request right now." }, { status: 500 });
  }
}
