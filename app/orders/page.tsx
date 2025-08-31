"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { OrderList } from "@/components/order-list";
import { OrderDetails } from "@/components/order-details";
import type { ApiOrder } from "@/lib/types"; // pastikan ApiOrder sesuai tipe API-mu

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders"); // sesuaikan dengan route API-mu
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: ApiOrder[] = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (selectedOrder) {
    return (
      <AppShell currentPage="orders">
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      </AppShell>
    );
  }

  return (
    <AppShell currentPage="orders">
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <OrderList orders={orders} onOrderSelect={setSelectedOrder} />
      )}
    </AppShell>
  );
}
