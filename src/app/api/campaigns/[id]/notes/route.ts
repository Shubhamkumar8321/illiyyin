import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

// Define expected route parameters
interface RouteParams {
  params: {
    id: string;
  };
}

// ✅ GET — Fetch all notes for a campaign
export async function GET(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const campaign = await Campaign.findById(params.id).select("notes");
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
export async function POST(req: Request, { params }: RouteParams) {
  try {
    await connectDB();

    const body = await req.json();
    const text: string = body.text;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Note text is required" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(params.id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }

    // Add new note at the top
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
