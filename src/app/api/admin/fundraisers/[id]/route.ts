import { NextResponse } from "next/server";
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

// ✅ GET — Fetch one fundraiser + all campaigns they created
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 🧩 Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid fundraiser ID" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🧩 Fetch fundraiser info
    const fundraiser = (await User.findById(id)
      .select("_id name email organization createdAt")
      .lean()) as Fundraiser | null;

    if (!fundraiser) {
      return NextResponse.json(
        { success: false, message: "Fundraiser not found" },
        { status: 404 }
      );
    }

    // 🧩 Fetch all campaigns by this fundraiser
    const campaigns = await Campaign.find({ createdById: fundraiser._id })
      .select(
        "_id title goal raised status endDate images organizer createdAt category"
      )
      .sort({ createdAt: -1 })
      .lean();

    // 🧩 Calculate total raised
    const totalRaised = campaigns.reduce(
      (sum, c) => sum + (c.raised || 0),
      0
    );

    // ✅ Return fundraiser + campaigns
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

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch fundraiser details";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
