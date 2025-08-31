// page.tsx untuk OrderConfirmation
"use client";

import { useEffect, useState } from "react";
import { OrderConfirmation } from "@/components/order-confirmation"; // pastikan import komponen dengan benar

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap params dengan await
    async function fetchParams() {
      const unwrappedParams = await params; // Unwrap params sebagai Promise
      setOrderId(unwrappedParams?.orderId);  // Set orderId setelah di unwrap
    }

    fetchParams();
  }, [params]);

  if (!orderId) {
    return <div>Loading...</div>;  // Menampilkan loading jika orderId belum ada
  }

  return <OrderConfirmation orderId={orderId} />;
}
