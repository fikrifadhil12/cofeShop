"use client";

import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { InfoRow } from "../components/InfoRow";
import PaymentHeader from "../components/PaymentHeader";
import { PayFooter } from "../components/PayFooter";
import { CopyField } from "../components/CopyField";

export default function EwalletPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  // Dummy total amount (nanti fetch dari API order dengan tipe ApiOrder)
  const totalAmount = 75000;

  // Dummy kode pembayaran
  const danaCode = `DANA-${orderId}`;
  const ovoCode = `OVO-${orderId}`;
  const gopayCode = `GOPAY-${orderId}`;

  // Dummy payload untuk QR
  const qrPayload = `EWALLET|ORDER:${orderId}|AMT:${(totalAmount / 100).toFixed(
    2
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <PaymentHeader title="Pembayaran E-Wallet" />

      <div className="px-4 py-6 pb-28 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <CopyField label="Kode DANA" value={danaCode} />
            <CopyField label="Kode OVO" value={ovoCode} />
            <CopyField label="Kode GoPay" value={gopayCode} />
          </div>

          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Atau scan QR demo:
            </div>
            <div className="mx-auto bg-white p-4 rounded-xl w-fit">
              <QRCode value={qrPayload} size={180} />
            </div>
            <div className="text-xs text-muted-foreground">
              *QR ini hanya contoh, tidak memproses pembayaran.
            </div>
          </div>

          <div className="border-t pt-3">
            <InfoRow label="Order ID" value={`#${orderId}`} />
            <InfoRow
              label="Jumlah"
              value={`Rp ${totalAmount.toLocaleString("id-ID")}`}
            />
            <InfoRow label="Metode" value="DANA / OVO / GoPay (demo)" />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="text-sm font-medium">Cara bayar (contoh):</div>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>Buka aplikasi e-wallet pilihan.</li>
            <li>Masukkan kode pembayaran di atas atau scan QR.</li>
            <li>Periksa nominal, lalu konfirmasi pembayaran.</li>
          </ol>
        </Card>
      </div>

      <PayFooter orderId={orderId} />
    </div>
  );
}
