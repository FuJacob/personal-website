import { NextRequest, NextResponse } from "next/server";

function isAuthed(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

function getAccountId(): string {
  const s3Url = process.env.S3_API_URL ?? "";
  // URL shape: https://<accountId>.r2.cloudflarestorage.com/...
  const match = s3Url.match(/https:\/\/([^.]+)\.r2\.cloudflarestorage\.com/);
  if (!match) throw new Error("Cannot parse account ID from S3_API_URL");
  return match[1];
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 },
      );
    }

    const accountId = getAccountId();
    const token = process.env.ACCOUNT_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ACCOUNT_API_TOKEN not configured" },
        { status: 500 },
      );
    }

    const bytes = await file.arrayBuffer();

    const r2Url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/jafu-resume/objects/jacob-fu-resume.pdf`;

    const r2Res = await fetch(r2Url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/pdf",
      },
      body: bytes,
    });

    if (!r2Res.ok) {
      const text = await r2Res.text();
      console.error("R2 upload failed:", r2Res.status, text);
      return NextResponse.json(
        { error: "Upload to R2 failed", detail: r2Res.status },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 },
    );
  }
}
