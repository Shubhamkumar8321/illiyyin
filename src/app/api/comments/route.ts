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

    // ✅ Validate & convert to ObjectId
    const campaignObjectId = new mongoose.Types.ObjectId(campaignId);

    const newComment = await Comment.create({
      campaignId: campaignObjectId,
      user: user || "Anonymous",
      text,
      amount: amount || 0,
      createdAt: new Date(),
    });

    console.log("✅ Comment saved:", newComment);

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error: unknown) {
    console.error("🚨 Error saving comment:", error);

    const message =
      error instanceof Error ? error.message : "Failed to save comment";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
