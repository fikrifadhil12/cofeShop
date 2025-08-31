import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { orderId } = req.query;

  try {
    await pool.query(`UPDATE orders SET status = 'completed' WHERE id = $1`, [
      orderId,
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "DB update failed" });
  }
}
