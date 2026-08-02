import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/guards";
import { s3 } from "@/lib/s3";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if (gate.response) return gate.response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { message: "Unsupported file type" },
      { status: 415 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ message: "File too large" }, { status: 413 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `mocube/${Date.now()}-${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  return NextResponse.json({ key, message: "File uploaded" });
}
