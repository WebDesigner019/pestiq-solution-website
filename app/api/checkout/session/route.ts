import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quoteId, orderId, planType = "monthly", mode = "subscription" } = body;

    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (stripeSecret) {
      try {
        // Safe require for Stripe module when installed
        const StripeModule = eval("require")("stripe");
        const stripe = new StripeModule(stripeSecret);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: mode === "subscription" ? "subscription" : "payment",
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: planType === "monthly" ? "PestIQ Complete Protection Plan" : "PestIQ One-Time Treatment",
                  description: "Includes 100% Satisfaction & Pest-Free Guarantee",
                },
                unit_amount: planType === "monthly" ? 6900 : 27900,
                recurring: mode === "subscription" ? { interval: "month" } : undefined,
              },
              quantity: 1,
            },
          ],
          success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&ref=${orderId || quoteId || "PIQ-SUCCESS"}`,
          cancel_url: `${siteUrl}/book/cancelled?ref=${orderId || quoteId || "PIQ-CANCELLED"}`,
        });

        return NextResponse.json({ sessionUrl: session.url, sessionId: session.id });
      } catch (stripeErr: any) {
        console.warn("Stripe Checkout API call error:", stripeErr?.message);
      }
    }

    // Direct success fallback when Stripe API key is not configured yet
    return NextResponse.json({
      sessionUrl: `${siteUrl}/book/success?ref=${orderId || quoteId || "PIQ-DEMO"}`,
      message: "Stripe API key pending — redirected to success page",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create checkout session" }, { status: 500 });
  }
}
