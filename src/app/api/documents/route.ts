import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectDB();
    const files = await Document.find({});
    return new Response(JSON.stringify({ success: true, files }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const uploadedFiles = formData.getAll("files");

    const savedFiles = [];
    for (const file of uploadedFiles) {
      const f = file as File;
      const doc = await Document.create({
        name: f.name,
        size: f.size,
        url: `/uploads/${f.name}`, // save path or use cloud storage
      });
      savedFiles.push(doc);
    }

    return new Response(JSON.stringify({ success: true, files: savedFiles }), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
