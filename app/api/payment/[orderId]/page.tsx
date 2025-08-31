"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react"; // ✅ pakai named export

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const method = searchParams.get("method"); // "qris" | "bank"

  const [loading, setLoading] = useState(false);

  const handlePaid = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/order-confirmation/${orderId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Pembayaran</h2>

        {method === "qris" && (
          <div className="text-center">
            <p className="mb-4">Silakan scan QRIS untuk pembayaran</p>
            <QRCodeCanvas value={`ORDER-${orderId}`} size={200} /> {/* ✅ */}
          </div>
        )}

        {method === "bank" && (
          <div className="text-center">
            <p className="mb-2">Transfer ke rekening berikut:</p>
            <p className="font-mono text-lg font-bold">1234-5678-9999</p>
            <p className="text-sm text-muted-foreground">Bank Demo</p>
          </div>
        )}
      </Card>

      <Button
        className="w-full h-12 rounded-xl"
        onClick={handlePaid}
        disabled={loading}
      >
        {loading ? "Memproses..." : "Saya sudah bayar"}
      </Button>
    </div>
  );
}
