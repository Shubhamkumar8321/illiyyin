import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";

// ✅ Next.js 15 param type
interface ParamsPromise {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ FIX

    await connectDB();

    const donations = await Donation.find({ campaignId: id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: donations });
  } catch (err: unknown) {
    console.error("Error fetching donations:", err);

    const message =
      err instanceof Error ? err.message : "Error loading donations";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
