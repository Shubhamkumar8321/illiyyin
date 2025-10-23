import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const updated = await Campaign.findByIdAndUpdate(params.id, { status: "rejected" }, { new: true });
    if (!updated)
      return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error rejecting campaign" }, { status: 500 });
  }
}
