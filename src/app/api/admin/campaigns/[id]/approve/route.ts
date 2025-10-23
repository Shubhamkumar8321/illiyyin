import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("🟢 Approving campaign:", params.id);
    await connectDB();

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      params.id,
      { status: "approved" },
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    console.log("✅ Campaign approved:", updatedCampaign.title);

    return NextResponse.json({
      success: true,
      message: "Campaign approved successfully",
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error("❌ Error approving campaign:", error);
    return NextResponse.json(
      { success: false, message: "Error approving campaign" },
      { status: 500 }
    );
  }
}
