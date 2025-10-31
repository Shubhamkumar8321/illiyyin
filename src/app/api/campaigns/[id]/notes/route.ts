import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

// ✅ Correct type for Next.js 15 dynamic route params
interface ParamsPromise {
  params: Promise<{ id: string }>;
}

// ✅ GET — Fetch all notes for a campaign
export async function GET(req: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ Fix here
    await connectDB();

    const campaign = await Campaign.findById(id).select("notes");
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, notes: campaign.notes });
  } catch (error) {
    console.error("GET Notes Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ POST — Add new note to campaign
export async function POST(req: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ Fix here
    await connectDB();

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Note text is required" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    const newNote = { text: text.trim(), createdAt: new Date() };
    campaign.notes.unshift(newNote);
    await campaign.save();

    return NextResponse.json({ success: true, note: newNote });
  } catch (error) {
    console.error("POST Note Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
