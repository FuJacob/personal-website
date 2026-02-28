import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isAuthed(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title, subtitle, created_at, content
      FROM writings
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch writings:", error);
    return NextResponse.json(
      { error: "Failed to fetch writings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, subtitle, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO writings (title, subtitle, content)
      VALUES (${title}, ${subtitle || ""}, ${content})
      RETURNING id, title, subtitle, created_at, content
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create writing:", error);
    return NextResponse.json(
      { error: "Failed to create writing" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Writing ID is required" },
        { status: 400 },
      );
    }

    const sql = getDb();
    await sql`DELETE FROM writings WHERE id = ${parseInt(id, 10)}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete writing:", error);
    return NextResponse.json(
      { error: "Failed to delete writing" },
      { status: 500 },
    );
  }
}
