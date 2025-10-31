import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

// ✅ Next.js 15 dynamic params type
interface ParamsPromise {
  params: Promise<{ id: string }>;
}

// ✅ GET — Get one file
export async function GET(req: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ FIX
    await connectDB();

    const doc = await Document.findById(id);
    if (!doc)
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, file: doc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// ✅ PATCH — Rename file
export async function PATCH(req: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ FIX
    await connectDB();

    const body = await req.json();
    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { name: body.name },
      { new: true }
    );

    if (!updatedDoc)
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, file: updatedDoc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// ✅ DELETE — Delete file
export async function DELETE(req: NextRequest, context: ParamsPromise) {
  try {
    const { id } = await context.params; // ✅ FIX
    await connectDB();

    const deletedDoc = await Document.findByIdAndDelete(id);

    if (!deletedDoc)
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, file: deletedDoc });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
