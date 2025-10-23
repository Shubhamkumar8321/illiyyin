import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await connectDB();

    // ✅ Find all fundraisers
    const fundraisers = await User.find({ role: "fundraiser" }).lean();

    // ✅ Optional: populate campaigns created by each fundraiser
    const withCampaigns = await Promise.all(
      fundraisers.map(async (f) => {
        const campaigns = await Campaign.find({ creator: f._id })
          .select("_id title")
          .lean();
        return { ...f, campaigns };
      })
    );

    return NextResponse.json({ success: true, fundraisers: withCampaigns });
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch fundraisers" },
      { status: 500 }
    );
  }
}
