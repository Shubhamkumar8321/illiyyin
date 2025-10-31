import { connectDB } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose";

// ✅ For Next.js 15+ App Router
interface Params {
  params: Promise<{ id: string }>;
}

// ====================
// GET — Fetch full Campaign by ID
// ====================
export async function GET(req: Request, context: Params) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid campaign ID" }),
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return new Response(
        JSON.stringify({ success: false, message: "Campaign not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: campaign }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in GET /api/campaigns/[id]:", err);
    
    const message = err instanceof Error ? err.message : "Failed to fetch campaign";

    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500 }
    );
  }
}

// ====================
// PATCH — Update Campaign by ID
// ====================
export async function PATCH(req: Request, context: Params) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body: Record<string, unknown> = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid campaign ID" }),
        { status: 400 }
      );
    }

    // ✅ Extract images safely
    const images: string[] = [];
    if (typeof body.description === "string") {
      const imageRegex = /<img[^>]+src="([^">]+)"/g;
      let match: RegExpExecArray | null;
      while ((match = imageRegex.exec(body.description)) !== null) {
        images.push(match[1]);
      }
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        goal: body.goal,
        endDate: body.endDate,
        images: images.length > 0 ? images : (body.images as string[]) ?? [],
        isFeatured: body.isFeatured,
      },
      { new: true }
    );

    if (!updatedCampaign) {
      return new Response(
        JSON.stringify({ success: false, message: "Campaign not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedCampaign }),
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in PATCH /api/campaigns/[id]:", err);

    const message = err instanceof Error ? err.message : "Failed to update campaign";

    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500 }
    );
  }
}

// ====================
// POST — Add a Supporter
// ====================
export async function POST(req: Request, context: Params) {
  try {
    await connectDB();
    const { id } = await context.params;
    
    const { name, email, amount, avatar, message } = await req.json() as {
      name: string;
      email?: string;
      amount: number;
      avatar?: string;
      message?: string;
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid campaign ID" }),
        { status: 400 }
      );
    }

    if (!name || !amount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name and amount are required.",
        }),
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return new Response(
        JSON.stringify({ success: false, message: "Campaign not found" }),
        { status: 404 }
      );
    }

    const newSupporter = {
      name,
      email: email || "",
      amount: Number(amount),
      avatar: avatar || "",
      message: message || "",
      daysAgo: 0,
      createdAt: new Date(),
    };

    campaign.supporters.unshift(newSupporter);
    campaign.raised = (campaign.raised || 0) + Number(amount);
    await campaign.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Supporter added successfully!",
        supporter: newSupporter,
      }),
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in POST /api/campaigns/[id]:", err);

    const message = err instanceof Error ? err.message : "Failed to add supporter";

    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500 }
    );
  }
}
