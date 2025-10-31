import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Donation from "@/models/Donation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook error";
    console.error("❌ Signature Error:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log("🔥 Webhook Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata ?? {};
    const amount = (session.amount_total ?? 0) / 100;

    console.log("🧾 Metadata:", m);

    if (!m.campaignId) {
      console.log("❌ campaignId missing in metadata");
      return NextResponse.json({ received: true });
    }

    await connectDB();
    console.log("✅ MongoDB Connected");

    await Donation.create({
      campaignId: m.campaignId,
      name: m.name || "Anonymous",
      comment: m.comment || "",
      amount,
    });

    await Campaign.findByIdAndUpdate(m.campaignId, {
      $inc: { raised: amount },
    });

    console.log("✅ Donation Saved & Campaign Updated");
  }

  return NextResponse.json({ received: true });
}
