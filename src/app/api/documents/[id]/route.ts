import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const doc = await Document.findById(params.id);
    if (!doc) return new Response(JSON.stringify({ success: false, message: "File not found" }), { status: 404 });
    return new Response(JSON.stringify({ success: true, file: doc }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedDoc = await Document.findByIdAndUpdate(params.id, { name: body.name }, { new: true });
    if (!updatedDoc) return new Response(JSON.stringify({ success: false, message: "File not found" }), { status: 404 });
    return new Response(JSON.stringify({ success: true, file: updatedDoc }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const deletedDoc = await Document.findByIdAndDelete(params.id);
    if (!deletedDoc) return new Response(JSON.stringify({ success: false, message: "File not found" }), { status: 404 });
    return new Response(JSON.stringify({ success: true, file: deletedDoc }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
