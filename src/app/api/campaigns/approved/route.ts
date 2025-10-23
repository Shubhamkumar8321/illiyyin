import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    // ✅ Fetch campaigns with status: "approved"
    const campaigns = await Campaign.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error fetching approved campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
