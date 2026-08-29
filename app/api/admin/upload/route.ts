import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { verifyAdmin } from "@/lib/adminAuth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

function slugify(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, WebP, GIF, AVIF` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB` },
        { status: 400 }
      );
    }

    // Ensure upload dir exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const ext = file.name.split(".").pop() || "webp";
    const baseName = slugify(file.name.replace(/\.[^.]+$/, ""));
    const timestamp = Date.now();
    const filename = `${baseName}-${timestamp}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const publicPath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = (await request.json()) as { filename: string };
    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 });
    }

    const filepath = path.join(UPLOAD_DIR, path.basename(filename));
    const { unlink } = await import("node:fs/promises");
    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
