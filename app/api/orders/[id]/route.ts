import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Fungsi GET untuk mengambil order berdasarkan id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Unwrap params.id menggunakan await
    const orderId = (await params).id;  // Unwrap params sebelum digunakan

    // Query untuk mengambil data order
    const orderResult = await pool.query(`SELECT * FROM orders WHERE id = $1`, [
      orderId,
    ]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderResult.rows[0];

    // Ambil items terkait
    const itemsResult = await pool.query(
      `SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.customizations,
        p.name AS product_name,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [orderId]
    );

    // Menambahkan item ke dalam order
    order.items = itemsResult.rows;

    // Mengembalikan data order dan items
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
