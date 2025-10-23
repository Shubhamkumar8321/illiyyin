import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const fundraiserId = searchParams.get("fundraiserId");
    const status = searchParams.get("status");

    const filter: any = {};
    if (fundraiserId) filter.fundraiserId = fundraiserId;
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .select("_id title goal raised category status images fundraiserId createdAt")
      .lean();

    return NextResponse.json({ success: true, campaigns });
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
