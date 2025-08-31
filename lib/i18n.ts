// lib/i18n.ts
import { useMemo } from "react";
import { useLanguage } from "@/hooks/use-language";

export const translations = {
  en: {
    // Navigation
    home: "Home",
    menu: "Menu",
    orders: "Orders",
    loyalty: "Loyalty",

    // Common
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    cancel: "Cancel",
    confirm: "Confirm",

    // Homepage
    welcome: "Welcome to BrewCraft",
    heroSubtitle: "Your premium coffee experience starts here",
    featuredItems: "Featured Items",
    viewAll: "View All",
    orderNow: "Order Now",

    // Menu
    ourMenu: "Our Menu",
    menuSubtitle: "Handcrafted with love, served with care",
    coffee: "Coffee",
    tea: "Tea",
    snacks: "Snacks",
    addToCart: "Add to Cart",
    customize: "Customize Order",

    // Cart & Checkout
    yourCart: "Your Cart",
    cartEmpty: "Your cart is empty",
    browseMenu: "Browse Menu",
    proceedToCheckout: "Proceed to Checkout",
    checkout: "Checkout",
    placeOrder: "Place Order",
    orderConfirmed: "Order Confirmed!",

    // Order Tracking
    yourOrders: "Your Orders",
    activeOrders: "Active Orders",
    orderHistory: "Order History",
    orderReceived: "Order Received",
    preparing: "Preparing",
    ready: "Ready for Pickup",
    completed: "Completed",

    // Loyalty
    brewcraftRewards: "BrewCraft Rewards",
    loyaltySubtitle: "Earn points with every sip, unlock amazing rewards",
    availablePoints: "Available Points",
    tierProgress: "Tier Progress",
    availableRewards: "Available Rewards",
    recentActivity: "Recent Activity",

    // Table Ordering
    tableWelcome: "Welcome to BrewCraft! Order directly from your table.",
    tableInformation: "Table Information",
    howToOrder: "How to Order",

    premiumQuality: "Premium Quality",
    premiumQualityDesc: "Sourced from the finest coffee farms worldwide",
    fastService: "Fast Service",
    fastServiceDesc: "Quick preparation without compromising quality",
    sustainable: "Sustainable",
    sustainableDesc: "Eco-friendly practices and ethical sourcing",

    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    bahasaIndonesia: "Bahasa Indonesia",
    english: "English",

    readyForPickup: "Ready for Pickup",
    trackCoffeeJourney: "Track your coffee journey",
    noOrdersYet: "No orders yet",
    startCoffeeJourney: "Start your coffee journey by placing your first order",
    items: "{count} item{countPlural}",
    table: "Table",
    viewDetails: "View Details",
    minutes: "{time} min",

    orderStatus: "Order Status",
    current: "Current",
    orderItems: "Order Items",
    quantity: "{count} item(s)",
    orderDetails: "Order Details",
    orderType: "Order Type",
    specialInstructions: "Special Instructions",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    tax: "Tax (10%)",
    serviceFee: "Service Fee",
    total: "Total",
    contactSupport: "Contact Support",
    reorderItems: "Reorder Items",

    thankYouPreparing: "Thank you for your order. We're preparing it now.", // en
    confirmed: "Confirmed",

    orderId: "Order ID",
    estimatedTime: "Estimated Time",
    pickup: "Pickup",
    takeaway: "Takeaway",
    yourItems: "Your Items",

    deliveryFee: "Delivery Fee",
    totalPaid: "Total Paid",
    paymentMethod: "Payment Method",
    qrisPayment: "QRIS Payment",
    paid: "Paid",
    trackYourOrder: "Track Your Order",
    orderMoreItems: "Order More Items",
    backToHome: "Back to Home",

    heroLocation: "Freshly brewed, locally sourced",
    heroDescription:
      "Discover our handcrafted coffee blends and artisanal treats, made with passion and served with care.",
    rating: "Rating",
    coffeeBlends: "Coffee Blends",
    customerRating: "Customer Rating",
    freshBrewing: "Fresh Brewing",
    howWouldYouLike: "How would you like your order?",
    dineIn: "Dine In",
    enjoyAtCafe: "Enjoy at our cafe",
    pickUpOrder: "Pick up your order",
    delivery: "Delivery",
    weBringItToYou: "We'll bring it to you",
    tableNumber: "Table Number",
    enterTableNumber: "Enter your table number",
    deliveryAddress: "Delivery Address",
    enterDeliveryAddress: "Enter your full delivery address",
    specialInstructionsPlaceholder:
      "Any special requests or notes for your order...",
    signatureEspresso: "Signature Espresso",
    caramelMacchiato: "Caramel Macchiato",
    eWallet: "E-Wallet",
    bankTransfer: "Bank Transfer",
    scanQrToPay: "Scan QR code to pay",
    supportedEWallets: "GoPay, OVO, DANA",
    directBankTransfer: "Direct bank transfer",

    popular: "Popular",
    new: "New",
    signatureEspressoDesc:
      "Rich, bold espresso with notes of chocolate and caramel",
    caramelMacchiatoDesc:
      "Smooth espresso with steamed milk and caramel drizzle",
    artisanCroissant: "Artisan Croissant",
    artisanCroissantDesc: "Buttery, flaky pastry baked fresh daily",
    matchaLatte: "Matcha Latte",
    matchaLatteDesc: "Premium Japanese matcha with creamy steamed milk",
    pastry: "Pastry",

    processing: "Processing...",
    tableNumberRequired: "Table number is required",
    deliveryAddressRequired: "Delivery address is required",

    orderFailed: "Failed to place order",
    createdAt: "Dibuat pada",
    customerName: "Nama Customer",
    enterYourName: "Masukkan nama Anda",
    payWithCash: "Pay with Cash",
  },
  id: {
    checkout: "Checkout",
    howWouldYouLike: "Bagaimana pesanan Anda?",
    dineIn: "Makan di Tempat",
    enjoyAtCafe: "Nikmati di kafe kami",
    takeaway: "Bawa Pulang",
    pickUpOrder: "Ambil pesanan Anda",
    delivery: "Antar",
    weBringItToYou: "Kami antar ke lokasi Anda",
    tableNumber: "Nomor Meja",
    enterTableNumber: "Masukkan nomor meja Anda",
    deliveryAddress: "Alamat Pengiriman",
    enterDeliveryAddress: "Masukkan alamat lengkap pengiriman",
    specialInstructions: "Instruksi Khusus (Opsional)",
    specialInstructionsPlaceholder:
      "Permintaan atau catatan khusus untuk pesanan Anda...",
    paymentMethod: "Metode Pembayaran",
    orderSummary: "Ringkasan Pesanan",
    subtotal: "Subtotal",
    tax: "Pajak",
    deliveryFee: "Biaya Pengiriman",
    total: "Total",
    placeOrder: "Pesan Sekarang",
    signatureEspresso: "Espresso Andalan",
    caramelMacchiato: "Caramel Macchiato",
    eWallet: "E-Wallet",
    bankTransfer: "Transfer Bank",
    scanQrToPay: "Pindai QR untuk membayar",
    supportedEWallets: "GoPay, OVO, DANA",
    directBankTransfer: "Transfer bank langsung",
    // Navigation
    home: "Beranda",
    menu: "Menu",
    orders: "Pesanan",
    loyalty: "Loyalitas",

    // Common
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    retry: "Coba Lagi",
    cancel: "Batal",
    confirm: "Konfirmasi",

    // Homepage
    welcome: "Selamat Datang di BrewCraft",
    heroSubtitle: "Pengalaman kopi premium Anda dimulai di sini",
    featuredItems: "Item Unggulan",
    viewAll: "Lihat Semua",
    orderNow: "Pesan Sekarang",

    // Menu
    ourMenu: "Menu Kami",
    menuSubtitle: "Dibuat dengan cinta, disajikan dengan perhatian",
    coffee: "Kopi",
    tea: "Teh",
    snacks: "Camilan",
    addToCart: "Tambah ke Keranjang",
    customize: "Sesuaikan Pesanan",

    // Cart & Checkout
    yourCart: "Keranjang Anda",
    cartEmpty: "Keranjang Anda kosong",
    browseMenu: "Jelajahi Menu",
    proceedToCheckout: "Lanjut ke Pembayaran",
    orderConfirmed: "Pesanan Dikonfirmasi!",

    // Order Tracking
    yourOrders: "Pesanan Anda",
    activeOrders: "Pesanan Aktif",
    orderHistory: "Riwayat Pesanan",
    orderReceived: "Pesanan Diterima",
    preparing: "Sedang Disiapkan",
    ready: "Siap Diambil",
    completed: "Selesai",

    // Loyalty
    brewcraftRewards: "Hadiah BrewCraft",
    loyaltySubtitle: "Dapatkan poin setiap tegukan, buka hadiah menakjubkan",
    availablePoints: "Poin Tersedia",
    tierProgress: "Progres Tingkat",
    availableRewards: "Hadiah Tersedia",
    recentActivity: "Aktivitas Terbaru",

    // Table Ordering
    tableWelcome: "Selamat datang di BrewCraft! Pesan langsung dari meja Anda.",
    tableInformation: "Informasi Meja",
    howToOrder: "Cara Memesan",

    premiumQuality: "Kualitas Premium",
    premiumQualityDesc: "Diambil dari perkebunan kopi terbaik di seluruh dunia",
    fastService: "Pelayanan Cepat",
    fastServiceDesc: "Persiapan cepat tanpa mengorbankan kualitas",
    sustainable: "Berkelanjutan",
    sustainableDesc: "Praktik ramah lingkungan dan sumber etis",

    lightMode: "Mode Terang",
    darkMode: "Mode Gelap",
    bahasaIndonesia: "Bahasa Indonesia",
    english: "Bahasa Inggris",

    readyForPickup: "Siap Diambil",
    trackCoffeeJourney: "Pantau perjalanan kopi Anda",
    noOrdersYet: "Belum ada pesanan",
    startCoffeeJourney:
      "Mulai perjalanan kopi Anda dengan membuat pesanan pertama",
    items: "{count} item{countPlural}",
    table: "Meja",
    viewDetails: "Lihat Detail",
    minutes: "{time} menit",

    orderStatus: "Status Pesanan",
    current: "Sedang berlangsung",
    orderItems: "Item Pesanan",
    quantity: "{count} item(s)",
    orderDetails: "Detail Pesanan",
    orderType: "Jenis Pesanan",
    serviceFee: "Biaya Layanan",
    contactSupport: "Hubungi Layanan",
    reorderItems: "Pesan Ulang Item",

    thankYouPreparing:
      "Terima kasih atas pesanan Anda. Kami sedang menyiapkannya.",
    confirmed: "Dikonfirmasi",
    orderId: "ID Pesanan",
    estimatedTime: "Perkiraan Waktu",
    pickup: "Ambil",
    yourItems: "Item Anda",
    totalPaid: "Total Dibayar",
    qrisPayment: "Pembayaran QRIS",
    paid: "Lunas",
    trackYourOrder: "Lacak Pesanan Anda",
    orderMoreItems: "Pesan Item Lain",
    backToHome: "Kembali ke Beranda",

    heroLocation: "Diseduh segar, bersumber lokal",
    heroDescription:
      "Temukan perpaduan kopi buatan tangan dan camilan artisanal kami, dibuat dengan cinta dan disajikan dengan perhatian.",
    rating: "Penilaian",
    coffeeBlends: "Perpaduan Kopi",
    customerRating: "Penilaian Pelanggan",
    freshBrewing: "Penyeduhan Segar",
    popular: "Populer",
    new: "Baru",
    signatureEspressoDesc:
      "Espresso kaya dan berani dengan aroma cokelat dan karamel",
    caramelMacchiatoDesc: "Espresso lembut dengan susu panas dan karamel",
    artisanCroissant: "Croissant Artisan",
    artisanCroissantDesc: "Pastry renyah dan mentega, dibuat segar setiap hari",
    matchaLatte: "Matcha Latte",
    matchaLatteDesc: "Matcha premium Jepang dengan susu panas yang creamy",

    pastry: "Pastry",

    processing: "Processing...",
    tableNumberRequired: "Table number is required",
    deliveryAddressRequired: "Delivery address is required",

    orderFailed: "Failed to place order",
    createdAt: "Created At",
    customerName: "Customer Name",
    enterYourName: "Enter your name",
    payWithCash: "Bayar Tunai",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const { language, ready } = useLanguage();

  // Gunakan useMemo agar fungsi t hanya berubah ketika language berubah
  const t = useMemo(
    () => (key: TranslationKey) => {
      return translations[language]?.[key] ?? translations.en[key] ?? key;
    },
    [language]
  );

  return { t, ready };
}
