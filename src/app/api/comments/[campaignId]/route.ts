import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  context: { params: Promise<{ campaignId: string }> } // ✅ promise type
) {
  try {
    await connectDB();

    // ✅ Await params before destructuring
    const { campaignId } = await context.params;

    // ✅ Validate campaignId
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      console.error("❌ Invalid campaignId:", campaignId);
      return NextResponse.json(
        { success: false, message: "Invalid campaignId" },
        { status: 400 }
      );
    }

    const campaignObjectId = new mongoose.Types.ObjectId(campaignId);

    // ✅ Fetch comments
    const comments = await Comment.find({ campaignId: campaignObjectId })
      .sort({ createdAt: -1 })
      .lean();

    console.log("✅ Found comments:", comments.length);

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    console.error("🚨 Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load comments" },
      { status: 500 }
    );
  }
}
