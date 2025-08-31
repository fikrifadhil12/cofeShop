import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params itu Promise
) {
  try {
    const { id } = await context.params; // 👈 tunggu params dulu
    const client = await pool.connect();

    const result = await client.query(
      `SELECT m.id AS modifier_id, m.name AS modifier_name, 
              m.multiple_selection AS multiple, m.required,
              o.id AS option_id, o.name AS option_name, o.price
       FROM product_modifiers pm
       JOIN modifiers m ON pm.modifier_id = m.id
       JOIN modifier_options o ON o.modifier_id = m.id
       WHERE pm.product_id = $1
       ORDER BY m.id, o.id`,
      [id] // ✅ aman, id sudah string
    );

    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json([]);
    }

    interface ModifierOption {
      id: string;
      name: string;
      price: number;
    }

    interface Modifier {
      id: string;
      name: string;
      multiple: boolean;
      required: boolean;
      options: ModifierOption[];
    }

    const transformedData: Modifier[] = result.rows.reduce(
      (acc: Modifier[], row) => {
        const existingModifier = acc.find(
          (m) => m.id === row.modifier_id.toString()
        );

        if (existingModifier) {
          existingModifier.options.push({
            id: row.option_id.toString(),
            name: row.option_name,
            price: parseFloat(row.price),
          });
        } else {
          acc.push({
            id: row.modifier_id.toString(),
            name: row.modifier_name,
            multiple: row.multiple,
            required: row.required,
            options: [
              {
                id: row.option_id.toString(),
                name: row.option_name,
                price: parseFloat(row.price),
              },
            ],
          });
        }
        return acc;
      },
      []
    );

    return NextResponse.json(transformedData);
  } catch (err) {
    console.error("Error fetching modifiers:", err);
    return NextResponse.json(
      { error: "Failed to fetch modifiers" },
      { status: 500 }
    );
  }
}
