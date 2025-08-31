"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PayFooter({ orderId }: { orderId: string }) {
  return (
    <div className="fixed bottom-20 left-4 right-4 z-40">
      <div className="bg-background border rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Sudah melakukan pembayaran?
        </span>
        <Link href={`/orders/${orderId}/confirmation`}>
          <Button className="rounded-lg">Saya sudah bayar</Button>
        </Link>
      </div>
    </div>
  );
}
