import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/guards";
import { s3 } from "@/lib/s3";

export async function DELETE(req: Request) {
  const gate = await requireAdminApi();
  if (gate.response) return gate.response;

  const { key } = await req.json();

  if (
    typeof key !== "string" ||
    !key.startsWith("mocube/") ||
    key.includes("..")
  ) {
    return NextResponse.json({ message: "Invalid key" }, { status: 400 });
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key: key,
  });

  await s3.send(command);

  return NextResponse.json({ message: "File deleted" });
}
