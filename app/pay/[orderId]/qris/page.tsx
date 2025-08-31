"use client";

import { useEffect, useState } from "react"; // Impor useState dan useEffect
import { Card } from "@/components/ui/card"; 
import { InfoRow } from "../components/InfoRow";
import PaymentHeader from "../components/PaymentHeader";
import { PayFooter } from "../components/PayFooter"; 
import QRCode from "react-qr-code";

export default function QrisPayPage({
  params,
}: {
  params: { orderId: string };
}) {
  // State untuk menyimpan orderId setelah unwrapping
  const [orderId, setOrderId] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Unwrap params dengan React.use()
    async function fetchParams() {
      const unwrappedParams = await params; // Unwrap promise
      if (unwrappedParams?.orderId) {
        setOrderId(unwrappedParams.orderId); // Set orderId setelah di unwrap
      }
      setLoading(false);
    }
    
    fetchParams();
  }, [params]); // Dependensi params agar berjalan saat params berubah

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderId) {
    return <div>Order ID not found</div>; // Handle jika orderId tidak ada
  }

  const totalAmount = 75000; // Dummy total amount

  const payload = buildDummyQrisPayload({
    orderId: orderId, // orderId sudah pasti ada sekarang
    amount: totalAmount,
    merchant: "CAFE DEMO",
  });

  return (
    <div className="min-h-screen bg-background">
      <PaymentHeader title="Pembayaran QRIS" />

      <div className="px-4 py-6 pb-28 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Scan untuk bayar
            </div>
            <div className="mx-auto bg-white p-4 rounded-xl w-fit">
              <QRCode value={payload} size={220} />
            </div>
            <div className="text-xs text-muted-foreground">
              *QR ini hanya contoh, tidak memproses pembayaran.
            </div>
          </div>

          <div className="border-t pt-3">
            <InfoRow label="Merchant" value="CAFE DEMO" />
            <InfoRow label="Order ID" value={`#${orderId}`} />
            <InfoRow label="Metode" value="QRIS (static demo)" />
            <InfoRow
              label="Jumlah"
              value={`Rp ${totalAmount.toLocaleString("id-ID")}`}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="text-sm font-medium">Cara bayar (contoh):</div>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>
              Buka aplikasi e-wallet atau mobile banking yang mendukung QRIS.
            </li>
            <li>Pilih menu Scan, lalu arahkan ke QR di atas.</li>
            <li>Pastikan nominal sesuai, lalu konfirmasi pembayaran.</li>
          </ol>
        </Card>
      </div>

      <PayFooter orderId={orderId} />
    </div>
  );
}

/**
 * Utility untuk membuat payload QRIS dummy
 * (hanya agar QR code terlihat realistis, tidak bisa digunakan beneran)
 */
function buildDummyQrisPayload({
  orderId,
  amount,
  merchant,
}: {
  orderId: string;
  amount: number;
  merchant: string;
}) {
  return `00020101021126580009ID.CO.QRIS.WWW01189360091700000012340215${merchant}0208${orderId}5303360540${amount}5802ID`;
}
