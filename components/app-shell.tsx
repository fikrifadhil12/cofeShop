"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useCartContext } from "@/hooks/use-cart";
import { useTranslation } from "@/lib/i18n";
import { CartDrawer } from "./cart-drawer";
import { useRouter } from "next/navigation";
import { ToastNotifications } from "./toast-notifications";
import {
  Search,
  ShoppingCart,
  Home,
  Coffee,
  Clock,
  Gift,
  Menu,
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  currentPage?: "home" | "menu" | "orders" | "loyalty";
  className?: string;
  cartButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function AppShell({
  children,
  currentPage = "home",
  className,
  cartButtonRef: externalCartButtonRef,
}: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const internalCartButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = externalCartButtonRef || internalCartButtonRef;
  const menuRef = useRef<HTMLDivElement>(null);

  const { items, updateQuantity, removeItem, itemCount } = useCartContext();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  // cek apakah sudah login (ada token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  // Tutup menu kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Disable scroll body saat drawer/menu terbuka
  useEffect(() => {
    document.body.style.overflow = isCartOpen || isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isMenuOpen]);

  // Mounted state buat tema biar tidak flicker
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: "home", label: t("home"), icon: Home, href: "/" },
    { id: "menu", label: t("menu"), icon: Coffee, href: "/menu" },
    { id: "orders", label: t("orders"), icon: Clock, href: "/orders" },
    { id: "loyalty", label: t("loyalty"), icon: Gift, href: "/loyalty" },
  ];

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleLanguageChange = (lang: "id" | "en") => {
    localStorage.setItem("brewcraft-language", lang);
    window.location.reload();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("customerPhone");
    localStorage.removeItem("cart");
    setLoggedIn(false);

    router.push("/");
    window.location.reload();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground transition-colors duration-300",
        className
      )}
    >
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b safe-area-top">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Home"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-lg">BrewCraft</span>
            </Link>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Cart button */}
              <Button
                ref={cartButtonRef}
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full right-4 mt-2 w-56 bg-popover border rounded-lg shadow-lg p-2 animate-in fade-in-80 slide-in-from-top-2 z-50"
          >
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" /> {t("lightMode")}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" /> {t("darkMode")}
                </>
              )}
            </Button>

            <div className="border-t my-1" />

            {/* Language */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleLanguageChange("id")}
              >
                <Globe className="w-4 h-4" /> {t("bahasaIndonesia")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleLanguageChange("en")}
              >
                <Globe className="w-4 h-4" /> {t("english")}
              </Button>
            </div>

            <div className="border-t my-1" />

            {/* Auth */}
            {loggedIn ? (
              <>
                <Link href="/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <User className="w-4 h-4" /> Pesanan Saya
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <User className="w-4 h-4" /> Login / Register
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Toasts */}
      <ToastNotifications />

      {/* Main content */}
      <main
        className={cn(
          "container mx-auto px-4 pb-20 pt-4",
          isCartOpen || isMenuOpen ? "blur-sm" : ""
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-sm bg-background/80 border-t safe-area-bottom">
        <div className="container mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-col gap-1 h-auto py-2 px-3 rounded-lg",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Link
                    href={item.href}
                    className="flex flex-col items-center gap-1"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        cartButtonRef={cartButtonRef}
      />
    </div>
  );
}
