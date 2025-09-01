"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Coffee, Utensils, ChevronLeft, Smartphone, Tablet, Monitor, User, Mail, Phone, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState("desktop");

  // Deteksi jenis perangkat
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType("mobile");
      } else if (width >= 640 && width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi password
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal register");
      }

      // Jika berhasil langsung ke login
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-amber-50 to-amber-100">
      {/* Sidebar/Banner untuk tablet dan desktop */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/api/placeholder/800/1000')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-amber-700/50 flex flex-col justify-center items-center p-8 text-white">
          <div className="flex items-center mb-6">
            <Coffee className="h-10 w-10 mr-3" />
            <Utensils className="h-10 w-10" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-4">Brew & Bites</h1>
          <p className="text-xl text-center max-w-md">Daftar sekarang untuk menikmati promo spesial dan pengalaman memesan yang lebih mudah</p>
          
          {/* Device indicator - hanya untuk development */}
          <div className="absolute bottom-4 left-4 flex items-center text-sm bg-amber-900/30 px-3 py-1 rounded-full">
            {deviceType === "mobile" && <Smartphone className="h-4 w-4 mr-1" />}
            {deviceType === "tablet" && <Tablet className="h-4 w-4 mr-1" />}
            {deviceType === "desktop" && <Monitor className="h-4 w-4 mr-1" />}
            <span className="capitalize">{deviceType} view</span>
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12">
        <div className="w-full max-w-md">
          {/* Header untuk mobile */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="flex items-center mb-4">
              <Coffee className="h-8 w-8 mr-2 text-amber-800" />
              <Utensils className="h-8 w-8 text-amber-800" />
            </div>
            <h1 className="text-2xl font-bold text-amber-900">Brew & Bites</h1>
            <p className="text-amber-700 text-sm mt-2 text-center">Buat akun baru</p>
          </div>

          {/* Tombol kembali untuk mobile */}
          <div className="md:hidden mb-6">
            <Button variant="ghost" size="sm" className="text-amber-800 pl-0" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
              <p className="text-gray-600 mt-2">Isi data diri Anda untuk mulai memesan</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password yang kuat"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>Dengan mendaftar, Anda menyetujui <Link href="/terms" className="text-amber-700 hover:underline">Syarat & Ketentuan</Link> dan <Link href="/privacy" className="text-amber-700 hover:underline">Kebijakan Privasi</Link> kami.</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Membuat akun...
                  </div>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-amber-700 font-medium hover:text-amber-800">
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Opsi login alternatif */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Atau daftar dengan</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Google
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Facebook
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>© 2023 Brew & Bites. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
