"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderConfirmation } from "@/components/order-confirmation";
import { createOrder } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import type { CartItem, OrderItemInput, CreateOrderInput } from "@/lib/types";
import { useCartContext } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const { clearCart, items: cartItems } = useCartContext(); // ✅ Ambil items dari cart context
  const router = useRouter();

  const handleOrderSubmit = async (orderData: CreateOrderInput) => {
    try {
      console.log("Order data received:", orderData);
      console.log("Cart items from context:", cartItems);
      console.log("Current cart items:", cartItems);
      console.log("Cart items length:", cartItems.length);
      // ✅ GUNAKAN CART ITEMS DARI CONTEXT, bukan dari orderData
      if (!cartItems || cartItems.length === 0) {
        toast({
          title: "Keranjang Kosong",
          description: "Silakan tambahkan item ke keranjang terlebih dahulu",
          variant: "destructive",
        });
        router.push("/menu");
        return;
      }

      const validItems = cartItems.filter(
        (item) => item.menuItem && item.menuItem.id
      );

      console.log("Valid items:", validItems);

      if (validItems.length === 0) {
        // ✅ Beri feedback yang lebih helpful
        toast({
          title: "Item Tidak Valid",
          description: "Item di keranjang tidak valid, silakan tambahkan ulang",
          variant: "destructive",
        });
        clearCart();
        router.push("/menu");
        return;
      }

      // ✅ Mapping CartItem ke OrderItemInput
      const mappedItems: OrderItemInput[] = validItems.map((item) => {
        if (!item.menuItem) {
          console.error("Item tanpa menuItem:", item);
          throw new Error("Item keranjang tidak valid");
        }

        const productId = Number(item.menuItem.id);
        if (isNaN(productId)) {
          console.error("ID produk tidak valid:", item.menuItem.id);
          throw new Error("ID produk tidak valid");
        }

        return {
          product_id: productId,
          quantity: item.quantity,
          price: item.totalPrice ?? item.menuItem.price * item.quantity,
          modifiers: Object.entries(item.selectedModifiers || {}).flatMap(
            ([modifierId, optionIds]) =>
              optionIds.map((optionId) => ({
                modifier_id: Number(modifierId),
                option_id: Number(optionId),
              }))
          ),
        };
      });

      // ✅ Hitung ulang total amount berdasarkan mapped items
      const subtotal = mappedItems.reduce((sum, item) => sum + item.price, 0);
      const tax = subtotal * 0.1;
      const deliveryFee = orderData.orderType === "delivery" ? 5000 : 0;
      const totalAmount = subtotal + tax + deliveryFee;

      // ✅ Siapkan payload
      const orderPayload: CreateOrderInput = {
        items: mappedItems,
        orderType: orderData.orderType,
        tableNumber: orderData.tableNumber,
        deliveryAddress: orderData.deliveryAddress,
        customerNotes: orderData.customerNotes,
        paymentMethod: orderData.paymentMethod,
        subtotal: subtotal,
        totalAmount: totalAmount,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
      };

      console.log("Order payload:", orderPayload);

      const response = await createOrder(orderPayload);

      if (response?.order?.id) {
        setOrderId(response.order.id.toString());
        setIsOrderPlaced(true);
        clearCart();

        toast({
          title: "Sukses",
          description: "Pesanan berhasil dibuat",
          variant: "default",
        });
      } else {
        throw new Error("Order ID tidak ditemukan dalam response");
      }
    } catch (error) {
      console.error("Order error details:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Gagal membuat pesanan, silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppShell>
      {!isOrderPlaced ? (
        <CheckoutForm onSubmit={handleOrderSubmit} />
      ) : (
        <OrderConfirmation orderId={orderId} />
      )}
    </AppShell>
  );
}
