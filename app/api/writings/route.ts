import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
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
      { status: 500 }
    );
  }
}
