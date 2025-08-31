"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/hooks/use-cart";

interface StickyOrderButtonProps {
  language?: "id" | "en"; // untuk multi-bahasa
  scrollToCategory?: string; // optional: scroll ke kategori tertentu
}

export function StickyOrderButton({
  language = "en",
  scrollToCategory,
}: StickyOrderButtonProps) {
  const router = useRouter();
  const { itemCount } = useCartContext(); // ambil jumlah item langsung dari context

  const handleOrderNow = () => {
    router.push("/menu");

    if (scrollToCategory) {
      setTimeout(() => {
        const el = document.getElementById(scrollToCategory);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const label = language === "id" ? "Pesan Sekarang" : "Order Now";

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 safe-area-bottom">
      <Button
        size="lg"
        className="w-full h-14 rounded-2xl shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        onClick={handleOrderNow}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>{label}</span>
            {itemCount > 0 && (
              <span className="bg-primary-foreground text-primary rounded-full px-2 py-1 text-xs font-bold">
                {itemCount}
              </span>
            )}
          </div>
          <ArrowRight className="w-5 h-5" />
        </div>
      </Button>
    </div>
  );
}
