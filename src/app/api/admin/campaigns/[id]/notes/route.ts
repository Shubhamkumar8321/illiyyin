import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

// ✅ Fetch campaign notes
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const campaign = await Campaign.findById(params.id).select("notes");
    if (!campaign)
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, notes: campaign.notes || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error fetching notes" }, { status: 500 });
  }
}

// ✅ Add a new note
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ success: false, message: "Note text required" }, { status: 400 });
    }

    const updated = await Campaign.findByIdAndUpdate(
      params.id,
      { $push: { notes: { text, createdAt: new Date() } } },
      { new: true, select: "notes" }
    );

    if (!updated)
      return NextResponse.json({ success: false, message: "Campaign not found" }, { status: 404 });

    return NextResponse.json({ success: true, notes: updated.notes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error adding note" }, { status: 500 });
  }
}
