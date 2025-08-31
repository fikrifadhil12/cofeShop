"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Receipt } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";


// ======================
// Types
// ======================
interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  subtotal: number;
  total_amount: number;
  delivery_fee: number;
  payment_method: string;
  order_type: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderConfirmationProps {
  orderId: string;
}

// ======================
// Component
// ======================
export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil data order dari API
  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-6 text-center">{t("loading")}...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">Order tidak ditemukan.</div>
    );
  }

  // Badge warna sesuai status
  const statusColor =
    order.status === "completed"
      ? "bg-green-100 text-green-800"
      : order.status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : order.status === "ready"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">
            {t("orderConfirmed")}
          </h1>
          <p className="text-muted-foreground">{t("thankYouPreparing")}</p>
        </div>

        {/* Order Details */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{t("orderDetails")}</h2>
            <Badge variant="secondary" className={statusColor}>
              {order.status}
            </Badge>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{t("orderId")}:</span>
              <span className="font-mono">{order.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{t("createdAt")}:</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{t("orderType")}:</span>
              <span>{order.order_type}</span>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">{t("yourItems")}</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    {item.quantity}x {item.product_name}
                  </span>
                </div>
                <span>
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>Rp {order.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("deliveryFee")}</span>
              <span>Rp {order.delivery_fee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>{t("totalPaid")}</span>
              <span>Rp {order.total_amount.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-4 mb-8">
          <h3 className="font-semibold mb-2">{t("paymentMethod")}</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xs">
                {order.payment_method.toUpperCase()}
              </span>
            </div>
            <span>{order.payment_method}</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/orders" className="block">
            <Button size="lg" className="w-full h-12 rounded-xl">
              {t("trackYourOrder")}
            </Button>
          </Link>

          <Link href="/menu" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 rounded-xl bg-transparent"
            >
              {t("orderMoreItems")}
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              variant="ghost"
              size="lg"
              className="w-full h-12 rounded-xl"
            >
              {t("backToHome")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
