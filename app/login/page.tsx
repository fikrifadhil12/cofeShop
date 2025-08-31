"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ state untuk pesan error
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // reset error tiap kali login

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ jika gagal, set error dari backend atau default
        throw new Error(data.error || "Email atau password salah");
      }

      // ✅ Simpan token JWT
      localStorage.setItem("token", data.token);

      // ✅ Redirect ke halaman utama
      router.push("/");
    } catch (err: any) {
      setError(err.message); // tampilkan pesan error
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {/* ✅ tampilkan pesan error kalau login gagal */}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <Input
          type="email"
          placeholder="Email"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>

        <p className="mt-3 text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
