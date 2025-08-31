import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProviderWrapper } from "@/components/theme-provider";
import { CartProvider } from "@/hooks/use-cart";
import { AppShell } from "@/components/app-shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "BrewCraft - Premium Coffee Experience",
  description: "Order premium coffee with our mobile-first experience",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <ThemeProviderWrapper>
          <CartProvider>{children}</CartProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
