import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    console.log("➡️ Creating new campaign...");
    await connectDB();

    const body = await req.json();
    console.log("🟢 Incoming body:", body);

    const { title, description, category, goal, endDate, createdById, createdByEmail } = body;

    // ✅ Validate required fields
    if (!title || !description || !category || !goal || !endDate || !createdByEmail) {
      return NextResponse.json(
        { success: false, message: "All fields (including user info) are required." },
        { status: 400 }
      );
    }

    // 🧩 Find the user from DB by email or id
    const user =
      (createdById && (await User.findById(createdById))) ||
      (await User.findOne({ email: createdByEmail }));

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    // 🧠 Extract <img> URLs from TinyMCE HTML
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const images: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(description)) !== null) {
      images.push(match[1]);
    }

    // ✅ Create campaign with both organizer name & email
    const newCampaign = await Campaign.create({
      title,
      description: description.trim(),
      category,
      goal: Number(goal),
      endDate: new Date(endDate),
      images: images.length > 0 ? images : ["/placeholder.jpg"],
      raised: 0,
      status: "pending",

      organizer: {
        name: user.name,
        email: user.email,
      },

      createdById: user._id,
      createdByEmail: user.email,
    });

    console.log("✅ Campaign created successfully:", newCampaign._id);

    return NextResponse.json({ success: true, data: newCampaign }, { status: 201 });
  } catch (error: unknown) {
    console.error("❌ Error creating campaign:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

// 🟢 Fetch all campaigns
export async function GET() {
  try {
    await connectDB();
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: campaigns }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error fetching campaigns:", error);

    const message =
      error instanceof Error ? error.message : "Server Error";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
