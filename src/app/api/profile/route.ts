import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🧩 Get user info from request body
    const { email, id } = await req.json();

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: "User email or id required" },
        { status: 400 }
      );
    }

    // 🧩 Find user by email or ID
    const user = id
      ? await User.findById(id).select("name email image role organization")
      : await User.findOne({ email }).select("name email image role organization");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Return user data
    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        image: user.image || "",
        role: user.role,
        organization: user.organization || "",
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
