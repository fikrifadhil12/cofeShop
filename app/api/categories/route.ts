// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT c.id, c.name, c.display_name, COUNT(p.id) AS count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_available = true
      GROUP BY c.id, c.name, c.display_name
      ORDER BY c.name;
    `);
    client.release();

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
