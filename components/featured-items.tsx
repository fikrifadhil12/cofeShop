"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export function FeaturedItems() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (itemId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const featuredItems: FeaturedItem[] = [
    {
      id: "1",
      name: t("signatureEspresso"),
      description: t("signatureEspressoDesc"),
      price: 4.5,
      image: "/placeholder-5bbrm.jpg",
      category: t("coffee"),
      isPopular: true,
    },
    {
      id: "2",
      name: t("caramelMacchiato"),
      description: t("caramelMacchiatoDesc"),
      price: 5.25,
      image: "/placeholder-e0reo.jpg",
      category: t("coffee"),
      isNew: true,
    },
    {
      id: "3",
      name: t("artisanCroissant"),
      description: t("artisanCroissantDesc"),
      price: 3.75,
      image: "/golden-croissant.png",
      category: t("pastry"),
    },
    {
      id: "4",
      name: t("matchaLatte"),
      description: t("matchaLatteDesc"),
      price: 4.95,
      image: "/placeholder-54x9c.jpg",
      category: t("tea"),
      isPopular: true,
    },
  ];

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold">
          {t("featuredItems")}
        </h2>
        <Button variant="ghost" size="sm" className="text-primary">
          {t("viewAll")}
        </Button>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {featuredItems.map((item) => (
          <Card
            key={item.id}
            className="flex-shrink-0 w-64 p-0 overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-40 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {item.isPopular && (
                  <Badge variant="destructive" className="text-xs">
                    {t("popular")}
                  </Badge>
                )}
                {item.isNew && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-500 text-white"
                  >
                    {t("new")}
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(item.id)}
              >
                <Heart
                  className={cn(
                    "w-4 h-4",
                    favorites.has(item.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  )}
                />
              </Button>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.category}
                  </Badge>
                </div>
                <span className="font-serif font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>

              <Button size="sm" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                {t("addToCart")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
