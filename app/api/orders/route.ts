import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // npm install jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("⚠️ JWT_SECRET belum diatur di .env.local");
}

/**
 * Helper: cek JWT token
 */
function getUserFromToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded; // { id, email, ... }
  } catch {
    return null;
  }
}

/**
 * POST /api/orders
 * Membuat order baru (login / guest)
 */
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req); // null kalau guest
    const body = await req.json();

    const {
      items = [],
      order_type,
      table_no,
      delivery_address,
      customer_name,
      customer_phone,
      customer_email,
      customer_notes,
      payment_method,
      subtotal,
      total_amount,
      delivery_fee = 0,
    } = body;

    if (
      !order_type ||
      !payment_method ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    const safeTableNo = order_type === "dine-in" ? table_no : null;
    const safeDeliveryAddress =
      order_type === "delivery" ? delivery_address : null;

    // === Ambil data user dari DB kalau login ===
    let finalName = customer_name || null;
    let finalPhone = customer_phone || null;
    let finalEmail = customer_email || null;

    if (user) {
      const userResult = await pool.query(
        "SELECT name, phone, email FROM users WHERE id = $1",
        [user.id]
      );
      const dbUser = userResult.rows[0];
      finalName = dbUser?.name || finalName;
      finalPhone = dbUser?.phone || finalPhone;
      finalEmail = dbUser?.email || finalEmail;
    }

    // === INSERT order ===
    const orderResult = await pool.query(
      `INSERT INTO orders 
       (user_id, order_type, table_no, delivery_address, 
        customer_name, customer_phone, customer_email, customer_notes, 
        payment_method, subtotal, total_amount, delivery_fee, status) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending')
       RETURNING *`,
      [
        user ? user.id : null,
        order_type,
        safeTableNo,
        safeDeliveryAddress,
        finalName,
        finalPhone,
        finalEmail,
        customer_notes || null,
        payment_method,
        subtotal,
        total_amount,
        delivery_fee,
      ]
    );

    const order = orderResult.rows[0];

    // === Simpan order_items ===
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price, customizations) 
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
          JSON.stringify(item.customizations || []),
        ]
      );
    }

    // === Ambil detail items ===
    const itemsResult = await pool.query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    return NextResponse.json(
      {
        success: true,
        order: {
          ...order,
          items: itemsResult.rows,
        },
        user_mode: user ? "login" : "guest",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Ambil semua order milik user (login) atau guest (by email/phone)
 */
export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    const { searchParams } = new URL(req.url);

    let query = `SELECT * FROM orders`;
    let values: any[] = [];

    if (user) {
      query += ` WHERE user_id = $1 ORDER BY created_at DESC`;
      values.push(user.id);
    } else {
      const email = searchParams.get("email");
      const phone = searchParams.get("phone");

      if (email) {
        query += ` WHERE customer_email = $1 ORDER BY created_at DESC`;
        values.push(email);
      } else if (phone) {
        query += ` WHERE customer_phone = $1 ORDER BY created_at DESC`;
        values.push(phone);
      }
    }

    const ordersResult = await pool.query(query, values);
    const orders = ordersResult.rows;

    // Ambil items tiap order
    for (let order of orders) {
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
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    return NextResponse.json(
      { success: true, orders, user_mode: user ? "login" : "guest" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get orders error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
