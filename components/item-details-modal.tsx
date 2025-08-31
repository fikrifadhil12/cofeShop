"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Minus, Plus, Heart, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem, Modifier } from "@/lib/types";
import { useCartContext } from "@/hooks/use-cart";

interface ItemDetailsModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function ItemDetailsModal({
  item,
  isOpen,
  onClose,
  cartButtonRef,
}: ItemDetailsModalProps) {
  const { addItem } = useCartContext();
  const itemImageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<HTMLImageElement | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, string[]>
  >({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [itemWithModifiers, setItemWithModifiers] = useState<MenuItem>(item);
  const [isLoadingModifiers, setIsLoadingModifiers] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedModifiers({});
      setIsFavorite(false);
      setIsAnimating(false);
      setItemWithModifiers(item);
    }
  }, [isOpen, item]);

  // Fetch modifiers when modal opens
  useEffect(() => {
    if (isOpen && (!item.modifiers || item.modifiers.length === 0)) {
      const fetchModifiers = async () => {
        setIsLoadingModifiers(true);
        try {
          const response = await fetch(`/api/products/${item.id}/modifiers`);
          if (response.ok) {
            const modifiers = await response.json();
            setItemWithModifiers({ ...item, modifiers });
          }
        } catch (error) {
          console.error(
            `Failed to fetch modifiers for item ${item.id}:`,
            error
          );
          setItemWithModifiers({ ...item, modifiers: [] });
        } finally {
          setIsLoadingModifiers(false);
        }
      };

      fetchModifiers();
    } else {
      setItemWithModifiers(item);
    }
  }, [isOpen, item]);

  const handleModifierSelect = useCallback(
    (modifierId: string, optionId: string) => {
      const modifier = itemWithModifiers.modifiers?.find(
        (m) => m.id === modifierId
      );
      if (!modifier) return;

      setSelectedModifiers((prev) => {
        const current = prev[modifierId] || [];

        if (modifier.multiple) {
          return current.includes(optionId)
            ? { ...prev, [modifierId]: current.filter((id) => id !== optionId) }
            : { ...prev, [modifierId]: [...current, optionId] };
        }

        return { ...prev, [modifierId]: [optionId] };
      });
    },
    [itemWithModifiers.modifiers]
  );

  const calculateTotalPrice = useCallback(() => {
    let total = itemWithModifiers.price;
    const modifiers = itemWithModifiers.modifiers || [];

    Object.entries(selectedModifiers).forEach(([modifierId, optionIds]) => {
      const modifier = modifiers.find((m) => m.id === modifierId);
      if (modifier) {
        optionIds.forEach((optionId) => {
          const option = modifier.options.find((o) => o.id === optionId);
          if (option) total += option.price;
        });
      }
    });

    return total * quantity;
  }, [
    itemWithModifiers.price,
    itemWithModifiers.modifiers,
    selectedModifiers,
    quantity,
  ]);

  const completeAddToCart = useCallback(() => {
    addItem(itemWithModifiers, quantity, selectedModifiers); // ✅ hanya 3 argumen
    setIsAnimating(false);
    onClose();
  }, [
    addItem,
    itemWithModifiers,
    quantity,
    selectedModifiers,
    onClose,
    calculateTotalPrice,
  ]);

  const animateToCart = useCallback(() => {
    try {
      // Check if required elements exist
      if (!itemImageRef.current || !cartButtonRef?.current) {
        completeAddToCart();
        return;
      }

      setIsAnimating(true);

      // Create animation element
      const imgClone = itemImageRef.current.cloneNode(true) as HTMLImageElement;
      animationRef.current = imgClone;

      const imgRect = itemImageRef.current.getBoundingClientRect();
      const cartRect = cartButtonRef.current.getBoundingClientRect();

      // Style the animation element
      imgClone.style.position = "fixed";
      imgClone.style.top = `${imgRect.top}px`;
      imgClone.style.left = `${imgRect.left}px`;
      imgClone.style.width = `${imgRect.width}px`;
      imgClone.style.height = `${imgRect.height}px`;
      imgClone.style.borderRadius = "0.75rem";
      imgClone.style.objectFit = "cover";
      imgClone.style.zIndex = "9999";
      imgClone.style.transition = `
        top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
        left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
        width 0.6s ease-out,
        height 0.6s ease-out,
        opacity 0.4s ease-out
      `;
      imgClone.style.pointerEvents = "none";
      imgClone.style.transform = "translateZ(0)";
      imgClone.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";

      document.body.appendChild(imgClone);

      // Calculate end position (center of cart button)
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;

      // Start animation on next frame
      requestAnimationFrame(() => {
        imgClone.style.top = `${endY}px`;
        imgClone.style.left = `${endX}px`;
        imgClone.style.width = "24px";
        imgClone.style.height = "24px";
        imgClone.style.opacity = "0.5";
      });

      // Clean up after animation
      const handleAnimationEnd = () => {
        imgClone.remove();
        animationRef.current = null;
        completeAddToCart();
      };

      imgClone.addEventListener("transitionend", handleAnimationEnd, {
        once: true,
      });
    } catch (error) {
      console.error("Animation error:", error);
      completeAddToCart();
    }
  }, [cartButtonRef, completeAddToCart]);

  const handleAddToCart = useCallback(() => {
    if (isAnimating) return;
    animateToCart();
  }, [animateToCart, isAnimating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-background rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b px-4 py-4 flex items-center justify-between z-10">
          <h2 className="font-serif text-xl font-bold">Customize Order</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isAnimating}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+120px)]">
          <div className="p-4">
            {/* Item Info */}
            <div className="flex gap-4 mb-4">
              <img
                ref={itemImageRef}
                src={itemWithModifiers.image || "/placeholder.svg"}
                alt={itemWithModifiers.name}
                className="w-24 h-24 object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg font-bold">
                    {itemWithModifiers.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                    disabled={isAnimating}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5",
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      )}
                    />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {itemWithModifiers.description}
                </p>
                <span className="font-serif text-xl font-bold text-primary">
                  Rp {itemWithModifiers.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Nutrition Info */}
            {(itemWithModifiers.allergens || itemWithModifiers.nutrition) && (
              <Card className="p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    Nutritional Information
                  </span>
                </div>
                {itemWithModifiers.allergens &&
                  itemWithModifiers.allergens.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground">
                        Contains:{" "}
                      </span>
                      <span className="text-xs">
                        {itemWithModifiers.allergens.join(", ")}
                      </span>
                    </div>
                  )}
                {itemWithModifiers.nutrition && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Calories: {itemWithModifiers.nutrition.calories}</div>
                    <div>Protein: {itemWithModifiers.nutrition.protein}g</div>
                    <div>Carbs: {itemWithModifiers.nutrition.carbs}g</div>
                    <div>Fat: {itemWithModifiers.nutrition.fat}g</div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Modifiers */}
          {isLoadingModifiers ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="px-4 space-y-6">
              {itemWithModifiers.modifiers?.map((modifier) => (
                <div key={modifier.id}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">
                      {modifier.name}
                      {modifier.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {modifier.multiple ? "Multiple" : "Choose one"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {modifier.options.map((option) => {
                      const isSelected =
                        selectedModifiers[modifier.id]?.includes(option.id) ||
                        false;

                      return (
                        <Button
                          key={option.id}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "justify-between h-auto p-3 text-left",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                          onClick={() =>
                            handleModifierSelect(modifier.id, option.id)
                          }
                          disabled={isAnimating}
                        >
                          <span>{option.name}</span>
                          <span className="font-semibold">
                            {option.price > 0
                              ? `+Rp ${option.price.toFixed(2)}`
                              : "Free"}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="sticky bottom-[64px] bg-background border-t p-4 z-20">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">
              Harga • Rp {calculateTotalPrice().toFixed(2)}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isAnimating}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isAnimating}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            size="lg"
            className={cn(
              "w-full h-12 rounded-xl font-semibold relative transition-opacity",
              isAnimating ? "opacity-90 cursor-not-allowed" : "hover:opacity-95"
            )}
            onClick={handleAddToCart}
            disabled={isAnimating || isLoadingModifiers}
            aria-busy={isAnimating}
          >
            {isAnimating ? (
              <span className="opacity-0" aria-hidden>
                Add to Cart
              </span>
            ) : (
              <span>Add to Cart </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
