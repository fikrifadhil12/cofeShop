import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ✅ Matikan cache bawaan Next.js
export const dynamic = "force-dynamic";

// GET /api/menu
export async function GET() {
  let client;
  try {
    client = await pool.connect();

    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock,
        p.is_available,
        p.image_url,
        c.id AS category_id,
        c.name AS category_name,
        c.display_name AS category_display
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_available = true
      ORDER BY c.name, p.name;
    `;

    const result = await client.query(query);

    // ✅ Tambahkan log hasil query biar tahu struktur datanya
    console.log("✅ Menu rows:", result.rows);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching menu:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch menu", detail: error.message },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}
