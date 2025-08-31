"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/app-shell";
import { MenuCategories, type Category } from "@/components/menu-categories";
import { MenuGrid } from "@/components/menu-grid";
import { ItemDetailsModal } from "@/components/item-details-modal";
import { getProducts } from "@/lib/api";
import type { MenuItem } from "@/lib/types";
import { useCartContext } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Coffee } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { backendToMenuItem } from "@/lib/converters";
import type { ApiProduct } from "@/lib/types";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartContext();
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch produk dan kategori sekaligus
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch produk
        const products: ApiProduct[] = await getProducts();
        const menuItems: MenuItem[] = products.map(backendToMenuItem);
        setMenu(menuItems);

        // ✅ DEBUG: Log produk
        console.log("Products:", products);
        console.log("Menu items:", menuItems);

        // Fetch kategori
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const categoryData = await res.json();

        const formattedCategories = categoryData.map((c: any) => ({
          id: c.name.toLowerCase(),
          name: c.display_name || c.name,
          icon: Coffee,
          count: Number(c.count),
        }));

        setCategories(formattedCategories);

        // ✅ DEBUG: Log kategori
        console.log("Categories:", categoryData);
        console.log("Formatted categories:", formattedCategories);

        // Set kategori aktif pertama kali
        if (formattedCategories.length > 0 && !activeCategory) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter produk sesuai kategori aktif
  const filteredItems = menu.filter((item) => item.category === activeCategory);

  if (isLoading) return <div className="p-6 text-center">Loading menu...</div>;

  return (
    <AppShell currentPage="menu" cartButtonRef={cartButtonRef}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="px-4 py-6 bg-card border-b">
          <h1 className="font-serif text-2xl font-bold text-center mb-2">
            Menu Kami
          </h1>
          <p className="text-center text-muted-foreground text-sm">
            Dibuat dengan penuh cinta, disajikan dengan perhatian
          </p>
        </div>

        {/* Kategori */}
        <MenuCategories
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categories}
        />

        {/* Grid Menu */}
        <MenuGrid
          items={filteredItems}
          onItemSelect={setSelectedItem}
          cartButtonRef={cartButtonRef} // ✅ INI YANG DITAMBAHKAN
        />

        {/* Modal Detail Item */}
        {selectedItem && (
          <ItemDetailsModal
            item={selectedItem}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            cartButtonRef={cartButtonRef}
          />
        )}
      </div>
    </AppShell>
  );
}
