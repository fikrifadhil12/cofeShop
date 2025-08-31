"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
  QrCode,
  Smartphone,
  CreditCard,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { useCartContext } from "@/hooks/use-cart";
import type { CreateOrderInput, OrderItemInput } from "@/lib/types";
// -----------------------------
// Tipe untuk currentUser
// -----------------------------
interface CurrentUser {
  id: number;
  name: string;
  email?: string;
  phone: string;
}

interface CheckoutFormProps {
  currentUser?: CurrentUser; // undefined = guest
  onSubmit: (orderData: CreateOrderInput) => void;
}

// -----------------------------
// Custom WhatsApp Icon
// -----------------------------
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 2.16.57 4.27 1.65 6.12L.5 23.5l5.62-1.61A11.4 11.4 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5zm0 20.8c-1.92 0-3.79-.52-5.42-1.5l-.39-.23-3.33.95.95-3.24-.26-.41a9.53 9.53 0 0 1-1.48-5.07c0-5.27 4.29-9.55 9.55-9.55s9.55 4.28 9.55 9.55-4.28 9.55-9.55 9.55zm5.26-7.17c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.15s-.73.92-.9 1.11c-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.34-1.44a8.73 8.73 0 0 1-1.61-2c-.17-.29-.02-.45.13-.6.14-.14.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.03-.51-.08-.15-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36s-1 1-1 2.42c0 1.42 1.02 2.8 1.16 3 .14.19 2.01 3.08 4.87 4.32.68.29 1.21.47 1.63.61.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
  </svg>
);

// -----------------------------
// CheckoutForm
// -----------------------------
export function CheckoutForm({ currentUser, onSubmit }: CheckoutFormProps) {
  const { t } = useTranslation();
  const { items } = useCartContext();

  // -----------------------------
  // State
  // -----------------------------
  const [orderType, setOrderType] = useState<
    "dine-in" | "takeaway" | "delivery"
  >("takeaway");
  const [paymentMethod, setPaymentMethod] = useState<
    "qris" | "ewallet" | "bank" | "cash"
  >("qris");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");

  // Hitung harga
  const subtotal = items.reduce(
    (acc, item) =>
      acc + (item.totalPrice ?? item.menuItem.price * item.quantity),
    0
  );
  const tax = subtotal * 0.1;
  const deliveryFee = orderType === "delivery" ? 5000 : 0;
  const finalTotal = subtotal + tax + deliveryFee;

  // Guest check
  const isGuest = !currentUser;

  // -----------------------------
  // Submit handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!items || items.length === 0) throw new Error(t("cartEmpty"));

      // Validasi guest
      if (isGuest) {
        if (!customerPhone.trim())
          throw new Error("Nomor WhatsApp wajib diisi");
        if (!customerName.trim()) throw new Error("Nama wajib diisi");
      }

      // Mapping CartItem -> OrderItemInput
      const orderItems: any[] = items
        .filter((item) => item.menuItem && item.menuItem.id)
        .map((item) => {
          const product = item.menuItem!;
          const productId = Number(product.id);

          if (isNaN(productId)) {
            throw new Error("Invalid product ID format");
          }

          const customizations = Object.entries(item.selectedModifiers || {})
            .flatMap(([modifierId, optionIds]) =>
              optionIds.map((optionId) => ({
                modifier_id: Number(modifierId),
                option_id: Number(optionId),
              }))
            )
            .filter((m) => !isNaN(m.modifier_id) && !isNaN(m.option_id));

          return {
            product_id: productId,
            quantity: item.quantity,
            price: product.price,
            customizations,
          };
        });

      if (orderItems.length === 0)
        throw new Error("Tidak ada produk valid di cart");

      // ✅ Payload ke backend pakai snake_case
      const orderPayload = {
        items: orderItems,
        order_type: orderType,
        table_no: orderType === "dine-in" ? tableNumber : undefined,
        delivery_address:
          orderType === "delivery" ? deliveryAddress : undefined,
        customer_notes: customerNotes,
        payment_method: paymentMethod,
        subtotal,
        total_amount: finalTotal,
        customer_name: currentUser?.name ?? customerName,
        customer_phone: currentUser?.phone ?? customerPhone,
        customer_email: currentUser?.email ?? undefined,
        delivery_fee: deliveryFee,
      };

      // Ambil token user (jika login)
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Kirim ke backend
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      console.log("Order berhasil:", data);

      if (isGuest) {
        localStorage.setItem("customerPhone", customerPhone);
        if (customerEmail) {
          localStorage.setItem("customerEmail", customerEmail);
        }
      }

      // ✅ Ambil orderId dari response backend
      const orderId =
        data?.id || data?.order_id || data?.order?.id || data?.data?.id;

      if (!orderId) throw new Error("Order ID tidak ditemukan");

      // ✅ Redirect sesuai payment method
      if (paymentMethod === "qris") {
        window.location.href = `/pay/${orderId}/qris`;
      } else if (paymentMethod === "ewallet") {
        window.location.href = `/pay/${orderId}/ewallet`;
      } else if (paymentMethod === "bank") {
        window.location.href = `/pay/${orderId}/bank`;
      } else {
        window.location.href = `/orders/${orderId}`;
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || t("orderFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-xl font-bold">{t("checkout")}</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 pb-24">
        {/* Order type */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t("howWouldYouLike")}</h2>
          <div className="grid grid-cols-1 gap-3">
            {["dine-in", "takeaway", "delivery"].map((type) => {
              const iconMap = {
                "dine-in": Building2,
                takeaway: Clock,
                delivery: MapPin,
              };
              const Icon = iconMap[type as keyof typeof iconMap];
              const isSelected = orderType === type;
              return (
                <Button
                  key={type}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "justify-start h-auto p-4 text-left",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() =>
                    setOrderType(type as "dine-in" | "takeaway" | "delivery")
                  }
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="font-semibold">{type}</div>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Customer phone */}
        {isGuest && (
          <Card className="p-4">
            <Label htmlFor="customer-phone" className="text-base font-semibold">
              Nomor WhatsApp
            </Label>
            <div className="flex items-center mt-2">
              <span className="text-green-500 mr-2">
                <WhatsAppIcon className="w-5 h-5" />
              </span>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="contoh: 6281234567890"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </Card>
        )}

        {/* Dine-in: table */}
        {orderType === "dine-in" && (
          <Card className="p-4 space-y-4">
            <Label htmlFor="table-number" className="text-base font-semibold">
              {t("tableNumber")}
            </Label>
            <Input
              id="table-number"
              placeholder={t("enterTableNumber")}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </Card>
        )}

        {/* Guest Name Input (dine-in, takeaway, delivery) */}
        {isGuest && (
          <Card className="p-4">
            <Label htmlFor="customer-name" className="text-base font-semibold">
              {t("customerName")}
            </Label>
            <Input
              id="customer-name"
              placeholder={t("enterYourName")}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </Card>
        )}

        {/* Delivery: address */}
        {orderType === "delivery" && (
          <Card className="p-4">
            <Label
              htmlFor="delivery-address"
              className="text-base font-semibold"
            >
              {t("deliveryAddress")}
            </Label>
            <Textarea
              id="delivery-address"
              placeholder={t("enterDeliveryAddress")}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              rows={3}
              required
            />
          </Card>
        )}

        {/* Customer notes */}
        <Card className="p-4">
          <Label htmlFor="notes" className="text-base font-semibold">
            {t("specialInstructions")}
          </Label>
          <Textarea
            id="notes"
            placeholder={t("specialInstructionsPlaceholder")}
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            rows={3}
          />
        </Card>

        {/* Payment */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t("paymentMethod")}</h2>
          <div className="grid grid-cols-1 gap-3">
            {["qris", "ewallet", "bank", "cash"].map((method) => {
              const iconMap = {
                qris: QrCode,
                ewallet: Smartphone,
                bank: CreditCard,
                cash: CreditCard,
              };
              const Icon = iconMap[method as keyof typeof iconMap];
              const isSelected = paymentMethod === method;
              return (
                <Button
                  key={method}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "justify-start h-auto p-4 text-left",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() =>
                    setPaymentMethod(
                      method as "qris" | "ewallet" | "bank" | "cash"
                    )
                  }
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="font-semibold">{method}</div>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengiriman</span>
              <span>
                {deliveryFee === 0 ? "Gratis" : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </Card>

        {/* Error */}
        {error && (
          <Card className="p-4 border-destructive bg-destructive/10">
            <div className="text-destructive text-center">{error}</div>
          </Card>
        )}

        {/* Submit */}
        <div className="fixed bottom-20 left-4 right-4 z-40 safe-area-bottom">
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-xl font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("processing")
              : `${t("placeOrder")} • ${formatCurrency(finalTotal)}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
