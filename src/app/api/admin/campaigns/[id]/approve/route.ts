import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // ✅ Correct type
) {
  try {
    const { id } = await context.params; // ✅ Await params

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
    return NextResponse.json(
      { success: false, message: "Server error approving campaign" },
      { status: 500 }
    );
  }
}
