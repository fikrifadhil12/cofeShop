"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
import { useCartContext } from "@/hooks/use-cart";

interface MenuGridProps {
  items: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function MenuGrid({
  items,
  onItemSelect,
  cartButtonRef,
}: MenuGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const { addItem } = useCartContext();

  const toggleFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    newFavorites.has(itemId)
      ? newFavorites.delete(itemId)
      : newFavorites.add(itemId);
    setFavorites(newFavorites);
  };

  const handleAddToCart = async (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Start animation
    setAnimatingItems((prev) => new Set(prev).add(item.id));

    try {
      await animateToCart(item, e);
      addItem(item, 1, {}); // Add to cart after animation
    } catch (error) {
      console.error("Animation error:", error);
      addItem(item, 1, {}); // Fallback: add to cart without animation
    } finally {
      // End animation
      setAnimatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const animateToCart = (
    item: MenuItem,
    e: React.MouseEvent
  ): Promise<void> => {
    return new Promise((resolve) => {
      const cardElement = e.currentTarget.closest(".menu-item-card");
      const itemImage = cardElement?.querySelector("img");

      if (!itemImage || !cartButtonRef?.current) {
        resolve();
        return;
      }

      const imgClone = itemImage.cloneNode(true) as HTMLImageElement;
      const imgRect = itemImage.getBoundingClientRect();
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
        imgClone.style.borderRadius = "50%";
      });

      // Clean up after animation
      const handleAnimationEnd = () => {
        imgClone.remove();
        resolve();
      };

      imgClone.addEventListener("transitionend", handleAnimationEnd, {
        once: true,
      });

      // Fallback timeout
      setTimeout(() => {
        if (document.body.contains(imgClone)) {
          imgClone.remove();
        }
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="menu-item-card overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
            onClick={() => onItemSelect(item)}
          >
            {/* Overlay animasi */}
            {animatingItems.has(item.id) && (
              <div className="absolute inset-0 bg-primary/20 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}

            <div className="flex gap-4 p-4">
              {/* Gambar Item */}
              <div className="relative w-20 h-20 flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
                {item.isPopular && (
                  <Badge className="absolute -top-1 -right-1 h-5 px-1.5 text-xs bg-orange-500 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    Populer
                  </Badge>
                )}
              </div>

              {/* Detail Item */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-base truncate pr-2">
                    {item.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={
                      favorites.has(item.id)
                        ? "Hapus dari favorit"
                        : "Tambahkan ke favorit"
                    }
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => toggleFavorite(item.id, e)}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        favorites.has(item.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      )}
                    />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-primary">
                      Rp {item.price.toFixed(2)}
                    </span>
                    {item.allergens && item.allergens.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Mengandung alergen
                      </Badge>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className={cn(
                      "gap-1 h-8 transition-all",
                      animatingItems.has(item.id) &&
                        "opacity-50 pointer-events-none"
                    )}
                    onClick={(e) => handleAddToCart(item, e)}
                    disabled={animatingItems.has(item.id)}
                  >
                    <Plus className="w-3 h-3" />
                    Tambah
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
