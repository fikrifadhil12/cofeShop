"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Coffee, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiOrder } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Helper: format rupiah
const formatCurrency = (value: string | number | null | undefined): string => {
  if (!value) return "Rp 0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

// Helper: format tanggal
const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "Tanggal tidak valid";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Tanggal tidak valid";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface OrderListProps {
  orders: ApiOrder[];
  onOrderSelect: (order: ApiOrder) => void;
}

const statusConfig = {
  pending: { label: "Menunggu", color: "bg-blue-500", icon: Clock },
  preparing: {
    label: "Sedang disiapkan",
    color: "bg-orange-500",
    icon: Coffee,
  },
  ready: { label: "Siap diambil", color: "bg-green-500", icon: CheckCircle },
  completed: { label: "Selesai", color: "bg-gray-500", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "bg-red-500", icon: Clock },
};

export function OrderList({ onOrderSelect }: OrderListProps) {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        let response;

        if (token) {
          // Mode login → pakai token
          response = await fetch("/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Mode guest → pakai email / phone
          const customerEmail = localStorage.getItem("customerEmail");
          const customerPhone = localStorage.getItem("customerPhone");

          if (!customerEmail && !customerPhone) {
            setError("Silakan login atau buat pesanan terlebih dahulu.");
            setLoading(false);
            return;
          }

          const params = new URLSearchParams();
          if (customerEmail) params.append("email", customerEmail);
          if (customerPhone) params.append("phone", customerPhone); // ✅ tetap bisa fetch meski tanpa email

          response = await fetch(`/api/orders?${params.toString()}`);
        }

        const result = await response.json();

        if (result.success) {
          if (Array.isArray(result.orders)) {
            setOrders(result.orders);
          } else if (result.order) {
            setOrders([result.order]);
          } else {
            setOrders([]);
          }
        } else {
          setError(result.error || "Gagal memuat pesanan");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Terjadi kesalahan saat memuat pesanan");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.status !== "cancelled"
  );
  const pastOrders = orders.filter(
    (order) => order.status === "completed" || order.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground mb-4" />
          <p>Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
          <h3 className="font-semibold text-lg mb-2">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 bg-card border-b">
        <h1 className="font-serif text-2xl font-bold text-center mb-2">
          Pesanan Anda
        </h1>
        <p className="text-center text-muted-foreground text-sm">
          Lacak perjalanan kopi Anda
        </p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4">Pesanan Aktif</h2>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelect={onOrderSelect}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past Orders */}
        {pastOrders.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg mb-4">Riwayat Pesanan</h2>
            <div className="space-y-4">
              {pastOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onSelect={onOrderSelect}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Coffee className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Belum ada pesanan</h3>
            <p className="text-muted-foreground text-center mb-6">
              Mulai perjalanan kopi Anda
            </p>
            <Button onClick={() => router.push("/menu")}>Lihat Menu</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onSelect,
}: {
  order: ApiOrder;
  onSelect: (order: ApiOrder) => void;
}) {
  const config =
    statusConfig[order.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = config.icon;

  // Handle jika items tidak ada (fallback ke products untuk kompatibilitas)
  const displayItems = order.items || order.products || [];

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(order)}
    >
      {/* Header Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", config.color)} />
          <Badge
            variant={
              order.status === "completed" || order.status === "cancelled"
                ? "secondary"
                : "default"
            }
            className="text-xs"
          >
            {config.label}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          #{order.invoice_number || `ORD-${order.id}`}
        </span>
      </div>

      {/* Info Order */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm mb-1">
            {displayItems.length} item
            {displayItems.length !== 1 ? "s" : ""}
          </h3>
          <p className="text-xs text-muted-foreground">
            {order.order_type === "dine-in" &&
              order.table_no &&
              `Meja ${order.table_no} • `}
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <div className="text-right">
          <div className="font-serif font-bold text-primary">
            {formatCurrency(order.total_amount)}
          </div>
        </div>
      </div>

      {/* Daftar Produk */}
      <div className="mb-4 space-y-2">
        {displayItems.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-md overflow-hidden bg-muted">
              <Image
                src={item.image_url || "/placeholder-coffee.jpg"}
                alt={item.product_name || `Produk ${item.product_id}`}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback jika gambar error
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-coffee.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {item.product_name || `Produk ${item.product_id}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatCurrency(Number(item.quantity) * Number(item.price))}
            </p>
          </div>
        ))}

        {displayItems.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{displayItems.length - 3} item lainnya
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          {order.payment_method === "cash" && "Tunai"}
          {order.payment_method === "qris" && "QRIS"}
          {order.payment_method === "ewallet" && "E-Wallet"}
          {order.payment_method === "bank" && "Transfer Bank"}
        </div>

        <Button variant="ghost" size="sm" className="gap-1 h-8">
          <span className="text-xs">Lihat Detail</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
