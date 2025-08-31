import type { ApiProduct, CreateOrderInput } from "@/lib/types";
import type { ApiOrderItem } from "@/lib/types";

/**
 * Ambil daftar produk dari API
 */
export async function getProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch("/api/menu", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log("API response:", data);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

/**
 * Buat order baru
 */

/**
 * Buat order baru
 */
export async function createOrder(order: CreateOrderInput) {
  const body = {
    items: order.items,
    order_type: order.orderType,
    table_no: order.tableNumber,
    delivery_address: order.deliveryAddress,
    customer_notes: order.customerNotes,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    total_amount: order.totalAmount,
    customer_name: order.customerName, // ✅ tambahin
    customer_phone: order.customerPhone, // ✅ tambahin
    customer_email: order.customerEmail, // ✅ tambahin
  };

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to create order: ${res.status} ${res.statusText}`);
  }

  const result = await res.json();

  // ✅ simpan email/phone ke localStorage biar OrderList bisa fetch
  if (order.customerEmail)
    localStorage.setItem("customerEmail", order.customerEmail);
  if (order.customerPhone)
    localStorage.setItem("customerPhone", order.customerPhone);

  return result;
}

export async function markOrderPaid(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}/pay`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}
