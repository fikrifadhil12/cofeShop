"use client";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative px-4 py-8">
      {/* Hero Image with Overlay */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
        <img
          src="/cozy-coffee-shop.png"
          alt={t("welcome")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Hero Content Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              4.8 {t("rating")}
            </Badge>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              <Clock className="w-3 h-3 mr-1" />
              15-20 {t("minutes")}
            </Badge>
          </div>
          <h1 className="font-serif text-2xl font-bold mb-1">
            {t("heroSubtitle")}
          </h1>
          <p className="text-sm text-white/90 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {t("heroLocation")}
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="text-center mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
          {t("welcome")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("heroDescription")}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-card rounded-xl border">
          <div className="font-serif text-lg font-bold text-primary">50+</div>
          <div className="text-xs text-muted-foreground">
            {t("coffeeBlends")}
          </div>
        </div>
        <div className="text-center p-3 bg-card rounded-xl border">
          <div className="font-serif text-lg font-bold text-primary">5★</div>
          <div className="text-xs text-muted-foreground">
            {t("customerRating")}
          </div>
        </div>
        <div className="text-center p-3 bg-card rounded-xl border">
          <div className="font-serif text-lg font-bold text-primary">24/7</div>
          <div className="text-xs text-muted-foreground">
            {t("freshBrewing")}
          </div>
        </div>
      </div>
    </section>
  );
}
