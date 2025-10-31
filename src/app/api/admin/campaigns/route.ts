import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const fundraiserId = searchParams.get("fundraiserId");
    const status = searchParams.get("status");

    // ✅ Correct type — a simple query object for mongoose
    const filter: Record<string, unknown> = {};

    if (fundraiserId) filter.fundraiserId = fundraiserId;
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "_id title goal raised category status images fundraiserId createdAt"
      )
      .lean();

    return NextResponse.json({ success: true, campaigns });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch campaigns";

    console.error("❌ Error fetching campaigns:", message);

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
