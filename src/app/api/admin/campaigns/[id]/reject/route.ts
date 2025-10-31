import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ params are Promise now

    await connectDB();

    const updated = await Campaign.findByIdAndUpdate(
      id,
      { status: "rejected" },
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
      campaign: updated,
      message: "Campaign rejected successfully",
    });
  } catch (error) {
    console.error("Reject Error:", error);
    return NextResponse.json(
      { success: false, message: "Error rejecting campaign" },
      { status: 500 }
    );
  }
}
