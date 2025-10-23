import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { campaignId, user, text, amount } = await req.json();

    if (!campaignId || !text) {
      return NextResponse.json(
        { success: false, message: "Missing campaignId or text" },
        { status: 400 }
      );
    }

    // ✅ Ensure campaignId is ObjectId
    const campaignObjectId = new mongoose.Types.ObjectId(campaignId);

    const newComment = await Comment.create({
      campaignId: campaignObjectId,
      user: user || "Anonymous",
      text,
      amount: amount || 0,
    });

    console.log("✅ Comment saved:", newComment);

    return NextResponse.json({ success: true, data: newComment });
  } catch (error: any) {
    console.error("🚨 Error saving comment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save comment" },
      { status: 500 }
    );
  }
}
