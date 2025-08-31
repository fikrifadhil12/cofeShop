"use client";

import { AppShell } from "@/components/app-shell";
import { HeroSection } from "@/components/hero-section";
import { FeaturedItems } from "@/components/featured-items";
import { StickyOrderButton } from "@/components/sticky-order-button";
import { useTranslation } from "@/lib/i18n";
import LoginPopup from "@/components/login-popup"; // 🔥 import popup

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <AppShell currentPage="home">
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Items Section */}
        <FeaturedItems />

        {/* Why Choose BrewCraft Section */}
        <section className="px-4 py-6">
          <h2 className="font-serif text-xl font-semibold mb-4">
            {t("featuredItems")}
          </h2>
          <div className="space-y-4">
            {/* Premium Quality */}
            <div className="flex gap-3 p-4 bg-card rounded-xl border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-serif font-bold">☕</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {t("premiumQuality")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("premiumQualityDesc")}
                </p>
              </div>
            </div>

            {/* Fast Service */}
            <div className="flex gap-3 p-4 bg-card rounded-xl border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-serif font-bold">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {t("fastService")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("fastServiceDesc")}
                </p>
              </div>
            </div>

            {/* Sustainable */}
            <div className="flex gap-3 p-4 bg-card rounded-xl border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-serif font-bold">🌱</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {t("sustainable")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("sustainableDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for sticky button */}
        <div className="h-20" />
      </div>

      {/* Sticky Order Button otomatis mengambil itemCount dari context */}
      <StickyOrderButton />

      {/* 🔥 Login Popup muncul otomatis saat pertama kali buka halaman */}
      <LoginPopup />
    </AppShell>
  );
}
