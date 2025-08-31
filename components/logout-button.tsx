"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus data login
    localStorage.removeItem("token");
    localStorage.removeItem("customerEmail");
    localStorage.removeItem("customerPhone");

    // (Opsional) Hapus keranjang
    localStorage.removeItem("cart");

    // Redirect ke homepage
    router.push("/");

    // Refresh biar state UI update
    window.location.reload();
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
