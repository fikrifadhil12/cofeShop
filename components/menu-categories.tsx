"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Leaf, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
}

interface MenuCategoriesProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  categories: Category[];
}

export function MenuCategories({
  activeCategory,
  onCategoryChange,
  categories,
}: MenuCategoriesProps) {
  return (
    <div className="sticky top-16 z-40 bg-background border-b">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              aria-pressed={isActive}
              className={cn(
                "flex-shrink-0 gap-2 h-10 px-4 rounded-full transition-colors",
                isActive && "bg-primary text-primary-foreground shadow-sm"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{category.name}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className="ml-1 h-5 px-1.5 text-xs"
              >
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
