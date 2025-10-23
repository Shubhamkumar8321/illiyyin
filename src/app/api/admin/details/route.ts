import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // ✅ Find admin user(s)
    const admin = await User.findOne({ role: "admin" })
      .select("name email role createdAt")
      .lean();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("❌ Error fetching admin details:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching admin details" },
      { status: 500 }
    );
  }
}
