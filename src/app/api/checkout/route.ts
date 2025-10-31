import Stripe from "stripe";
import { NextResponse } from "next/server";

// ✅ Correctly typed Stripe instance (no `unknown`)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body: {
    amount: number;
    currency: string;
    frequency: string;
    campaignId?: string;
    comment?: string;
    name?: string;
  } = await req.json();

  const { amount, currency, frequency, campaignId, comment, name } = body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: frequency === "recurring" ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Donation" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=cancel`,

      metadata: {
        campaignId: campaignId ?? "",
        comment: comment ?? "",
        amount: String(amount),
        name: name ?? "Anonymous",
      },

      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Stripe Checkout Error";

    console.error("❌ Stripe Checkout Error:", message);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
