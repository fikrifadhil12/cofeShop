"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { RefObject, useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onCheckout: () => void;
  cartButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCheckout,
  cartButtonRef,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1;
  const deliveryFee = subtotal > 25 ? 0 : 2.99;
  const total = subtotal + tax + deliveryFee;

  useEffect(() => {
    if (isOpen && cartButtonRef?.current) {
      cartButtonRef.current.classList.add("scale-110");
      setTimeout(() => {
        cartButtonRef.current?.classList.remove("scale-110");
      }, 300);
    }
  }, [isOpen, cartButtonRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-background rounded-t-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-background border-b px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-serif text-xl font-bold">Keranjang Anda</h2>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items - Area yang bisa discroll */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 h-full">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Keranjang Anda kosong
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Tambahkan beberapa item lezat dari menu kami
              </p>
              <Button onClick={onClose}>Jelajahi Menu</Button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.menuItem.image || "/placeholder.svg"}
                      alt={item.menuItem.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">
                        {item.menuItem.name}
                      </h3>

                      {/* Selected Modifiers */}
                      <div className="space-y-1 mb-2">
                        {Object.entries(item.selectedModifiers).map(
                          ([modifierId, optionIds]) => {
                            // Tambahkan pengecekan keamanan
                            const modifier = item.menuItem.modifiers?.find(
                              (m) => m.id === modifierId
                            );

                            // Jika modifier tidak ditemukan atau tidak ada option, skip
                            if (!modifier || optionIds.length === 0)
                              return null;

                            return (
                              <div
                                key={modifierId}
                                className="text-xs text-muted-foreground"
                              >
                                {modifier.name}:{" "}
                                {optionIds
                                  .map((optionId) => {
                                    const option = modifier.options.find(
                                      (o) => o.id === optionId
                                    );
                                    return option?.name || "Unknown option";
                                  })
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            );
                          }
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-primary">
                          ${item.totalPrice.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-transparent"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-transparent"
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Order Summary */}
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Pengiriman</span>
                    <span>
                      {deliveryFee === 0
                        ? "Gratis"
                        : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Gratis pengiriman untuk pesanan di atas $25
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Checkout Button - Tetap terlihat di bagian bawah */}
        {items.length > 0 && (
          <div className="flex-shrink-0 bg-background border-t p-4 safe-area-bottom">
            <Button
              size="lg"
              className="w-full h-12 rounded-xl font-semibold gap-2"
              onClick={onCheckout}
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
