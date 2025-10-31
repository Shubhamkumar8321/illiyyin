import { NextResponse } from "next/server";
import{connectDB}  from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const donations = await Donation.find({ campaignId: params.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: donations });
  } catch (err: any) {
    console.error("Error fetching donations:", err);
    return NextResponse.json(
      { success: false, message: "Error loading donations" },
      { status: 500 }
    );
  }
}
