"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PaymentHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-50 bg-background border-b px-4 py-4">
      <div className="flex items-center gap-3">
        <Link href="/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-serif text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
}
