"use client";
import { Card } from "@/components/ui/card";
import PaymentHeader from "../components/PaymentHeader";
import { InfoRow } from "../components/InfoRow";
import { CopyField } from "../components/CopyField";
import { PayFooter } from "../components/PayFooter";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react"; // ⬅️ pastikan ada import React

function buildVaNumber(orderId: string, bankCode = "8808") {
  // Dummy VA: BANKCODE + 12-digit padded orderId
  const pad = orderId.replace(/\D/g, "").slice(-12).padStart(12, "0");
  return `${bankCode}${pad}`;
}

export default function BankPayPage({
  params,
}: {
  params: Promise<{ orderId: string }>; // ⬅️ params sekarang Promise
}) {
  const { orderId } = React.use(params); // ⬅️ unwrap pakai React.use()
  const [bank, setBank] = useState("BCA");

  const bankCode =
    bank === "BCA"
      ? "8808"
      : bank === "BNI"
      ? "8077"
      : bank === "BRI"
      ? "8899"
      : "8808";

  const totalAmount = 75000; // demo
  const va = useMemo(
    () => buildVaNumber(orderId, bankCode),
    [orderId, bankCode]
  );

  return (
    <div className="min-h-screen bg-background">
      <PaymentHeader title="Pembayaran Virtual Account" />

      <div className="px-4 py-6 pb-28 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex gap-2">
            {["BCA", "BNI", "BRI"].map((b) => (
              <Button
                key={b}
                variant={bank === b ? "default" : "outline"}
                onClick={() => setBank(b)}
              >
                {b}
              </Button>
            ))}
          </div>

          <CopyField label={`Nomor VA ${bank}`} value={va} />

          <div className="border-t pt-3">
            <InfoRow label="Order ID" value={`#${orderId}`} />
            <InfoRow
              label="Jumlah"
              value={`Rp ${totalAmount.toLocaleString("id-ID")}`}
            />
            <InfoRow label="Batas bayar" value="3 jam" />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="text-sm font-medium">Cara bayar (contoh):</div>
          <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
            <li>
              Masuk ke m-banking {bank} &gt; Pembayaran &gt; Virtual Account.
            </li>
            <li>Masukkan nomor VA di atas, lalu cek nama merchant.</li>
            <li>Konfirmasi dan selesaikan pembayaran.</li>
          </ol>
        </Card>
      </div>

      <PayFooter orderId={orderId} />
    </div>
  );
}
