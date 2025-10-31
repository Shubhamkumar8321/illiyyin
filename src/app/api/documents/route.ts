import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

export async function GET() {
  try {
    await connectDB();
    const files = await Document.find({});
    return new Response(JSON.stringify({ success: true, files }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ success: false, message }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const uploadedFiles = formData.getAll("files");

    interface SavedFile {
  name: string;
  size: number;
  url: string;
  _id?: string;
}

const savedFiles: SavedFile[] = [];

    for (const file of uploadedFiles) {
      const f = file as File;

      const doc = await Document.create({
        name: f.name,
        size: f.size,
        url: `/uploads/${f.name}`, // OR cloud path
      });

      savedFiles.push(doc);
    }

    return new Response(JSON.stringify({ success: true, files: savedFiles }), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload files";
    return new Response(JSON.stringify({ success: false, message }), { status: 500 });
  }
}
