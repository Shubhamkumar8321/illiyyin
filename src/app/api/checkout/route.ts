// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2023-10-16",
// } as any);

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { amount, currency, frequency, campaignId, comment } = body;

//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: frequency === "recurring" ? "subscription" : "payment",
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: { name: "Donation" },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=cancel`,
//       metadata: {
//         campaignId,
//         comment: comment || "",
//         amount: String(amount),
//         name: "Anonymous",
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (err: any) {
//     console.error("Stripe Checkout Error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
} as any);

export async function POST(req: Request) {
  const body = await req.json();
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
        campaignId,
        comment: comment || "",
        amount: String(amount),
        name: name || "Anonymous",
      },

      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
