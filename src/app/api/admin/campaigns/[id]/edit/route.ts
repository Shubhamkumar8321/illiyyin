import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const campaign = await Campaign.findById(params.id);
    if (!campaign)
      return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching campaign" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await Campaign.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated)
      return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });
    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating campaign" }, { status: 500 });
  }
}
