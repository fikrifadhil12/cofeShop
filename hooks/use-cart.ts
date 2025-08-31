"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, MenuItem } from "@/lib/types";

// =====================
// CartContext + useCart
// =====================
export interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedModifiers: Record<string, string[]>
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cart = useProvideCart();
  // Gunakan React.createElement supaya valid di .ts
  return React.createElement(CartContext.Provider, { value: cart }, children);
};

export function useCartContext(): CartContextType {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartContext must be used within CartProvider");
  return context;
}

// =====================
// Hook useProvideCart
// =====================
function useProvideCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const calculateItemPrice = useCallback(
    (
      menuItem: MenuItem,
      selectedModifiers: Record<string, string[]>,
      quantity: number
    ) => {
      const modifierTotal = Object.entries(selectedModifiers).reduce(
        (sum, [modId, optionIds]) => {
          // Gunakan optional chaining dan fallback array kosong
          const modifier = menuItem.modifiers?.find((m) => m.id === modId);
          if (!modifier) return sum;

          const optionSum = optionIds.reduce((s, optId) => {
            const option = modifier.options.find((o) => o.id === optId);
            return option ? s + option.price : s;
          }, 0);
          return sum + optionSum;
        },
        0
      );
      return (menuItem.price + modifierTotal) * quantity;
    },
    []
  );

  const addItem = useCallback(
    (
      menuItem: MenuItem,
      quantity: number,
      selectedModifiers: Record<string, string[]>
    ) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (i) =>
            i.menuItem.id === menuItem.id &&
            JSON.stringify(i.selectedModifiers) ===
              JSON.stringify(selectedModifiers)
        );

        if (existingIndex >= 0) {
          const updatedItems = [...prevItems];
          const existingItem = updatedItems[existingIndex];
          const newQty = existingItem.quantity + quantity;
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQty,
            totalPrice: calculateItemPrice(menuItem, selectedModifiers, newQty),
          };
          return updatedItems;
        } else {
          const newItem: CartItem = {
            id: `cart-${Date.now()}`,
            menuItem,
            quantity,
            selectedModifiers,
            totalPrice: calculateItemPrice(
              menuItem,
              selectedModifiers,
              quantity
            ),
          };
          return [...prevItems, newItem];
        }
      });
    },
    [calculateItemPrice]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateItemPrice(
                    item.menuItem,
                    item.selectedModifiers,
                    quantity
                  ),
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [calculateItemPrice]
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    items,
    itemCount,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
