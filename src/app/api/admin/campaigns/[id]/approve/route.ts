import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // ✅ Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid campaign ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Campaign.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Campaign approved successfully",
      data: updated,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error approving campaign";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
