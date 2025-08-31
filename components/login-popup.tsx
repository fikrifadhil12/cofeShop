"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // kalau sudah login, jangan tampilkan popup
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // kalau user sudah menutup popup di sesi ini, jangan munculkan lagi
    const dismissed =
      typeof window !== "undefined"
        ? sessionStorage.getItem("popupDismissed")
        : null;

    if (!token && !dismissed) setOpen(true);
  }, []);

  const handleGuest = () => {
    sessionStorage.setItem("popupDismissed", "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Selamat Datang 👋
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-4">
          Kamu bisa memesan tanpa login, atau login untuk menikmati fitur
          lengkap & poin loyalty.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={handleGuest} variant="outline">
            Pesan tanpa login
          </Button>
          <Link href="/login">
            <Button className="w-full">Login / Register</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
