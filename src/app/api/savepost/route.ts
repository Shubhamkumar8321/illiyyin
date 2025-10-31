import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, html, text, createdAt } = body;

    if (!title || !slug || !html) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, `${slug}.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify({ title, slug, html, text, createdAt }, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true, fileName: `${slug}.json` });
  } catch (err: unknown) {
    console.error("Save post error:", err);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
