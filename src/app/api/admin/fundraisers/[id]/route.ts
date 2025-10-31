import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import mongoose, { Types } from "mongoose";

interface Fundraiser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  organization?: string;
  createdAt?: Date;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Fix: params is Promise

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid fundraiser ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const fundraiser = (await User.findById(id)
      .select("_id name email organization createdAt")
      .lean()) as Fundraiser | null;

    if (!fundraiser) {
      return NextResponse.json(
        { success: false, message: "Fundraiser not found" },
        { status: 404 }
      );
    }

    const campaigns = await Campaign.find({ createdById: fundraiser._id })
      .select(
        "_id title goal raised status endDate images organizer createdAt category"
      )
      .sort({ createdAt: -1 })
      .lean();

    const totalRaised = campaigns.reduce(
      (sum, c) => sum + (c.raised || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        fundraiser,
        campaigns,
        totalRaised,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ Error fetching fundraiser details:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch fundraiser details",
      },
      { status: 500 }
    );
  }
}
