// lib/converters.ts
import {
  MenuItem,
  CartItem,
  ApiProduct,
  Modifier,
  ApiOrderItem,
  Order,
  ApiOrder,
} from "./types";

// ✅ FIXED: Fungsi yang benar untuk Google Drive URL
function convertGoogleDriveUrl(url: string): string {
  if (url.includes("drive.google.com")) {
    const fileId = url.match(/id=([^&]+)/)?.[1];
    if (fileId) {
      // ✅ FORMAT YANG BENAR UNTUK TAG <IMG> - Google Drive thumbnail
      return `https://lh3.googleusercontent.com/d/${fileId}=s300`;

      // ALTERNATIF: Google Drive direct download (jika thumbnail tidak work)
      // return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  return url;
}

// ✅ FIXED: Simple placeholder menggunakan file SVG lokal
function getDefaultImage(): string {
  return "/placeholder.svg";
}

// ✅ FIXED: Handle price conversion dari string ke number
function convertPrice(price: any): number {
  if (typeof price === "string") {
    // Hapus karakter non-numeric dan convert ke float
    const numericValue = parseFloat(price.replace(/[^\d.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  }
  return typeof price === "number" ? price : 0;
}

// ✅ FIXED: Validasi dan konversi image URL
function processImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return getDefaultImage();

  // Handle Google Drive URLs
  if (imageUrl.includes("drive.google.com")) {
    return convertGoogleDriveUrl(imageUrl);
  }

  // Handle base64 images - validasi panjang dan format
  if (imageUrl.startsWith("data:image/")) {
    if (imageUrl.length > 1000 && isValidBase64(imageUrl)) {
      return imageUrl;
    }
    return getDefaultImage();
  }

  // Handle regular URLs
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return getDefaultImage();
}

// ✅ Validasi base64 image
function isValidBase64(base64String: string): boolean {
  try {
    // Cek jika ini data URL yang valid
    if (!base64String.includes(",")) return false;

    const base64Data = base64String.split(",")[1];
    // Decode base64 untuk validasi
    atob(base64Data);
    return true;
  } catch {
    return false;
  }
}

// ✅ FIXED: Konversi produk dengan error handling lengkap
// Di fungsi backendToMenuItem:
export function backendToMenuItem(product: ApiProduct): MenuItem {
  const price = convertPrice(product.price);
  const imageUrl = processImageUrl(product.image_url);

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description || "Tidak ada deskripsi",
    price: price,
    image: imageUrl,
    // ✅ langsung pakai nama kategori dari DB (fallback ke "other")
    category: (product.category_name || "other").toLowerCase(),
    modifiers: [],
    isPopular: product.is_popular || false,
    isNew: product.is_new || false,
  };
}

// ✅ FIXED: Helper untuk mapping kategori dengan type safety
function mapCategory(categoryId: number): string {
  const categoryMap: Record<number, string> = {
    1: "coffee",
    2: "tea",
    3: "pastry",
    4: "non-coffee",
  };
  return categoryMap[categoryId] || "other";
}
// ✅ FIXED: Konversi cart items ke payload order dengan validasi
export function cartToOrderPayload(
  cartItems: CartItem[],
  orderType: Order["orderType"],
  tableNumber?: string
): {
  table_no?: string;
  order_type: string;
  items: ApiOrderItem[];
} {
  // Validasi input
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart items cannot be empty");
  }

  return {
    table_no: tableNumber,
    order_type: orderType,
    items: cartItems.map((item) => ({
      product_id: Number(item.menuItem.id),
      quantity: item.quantity,
      price: item.menuItem.price,
      modifiers: convertModifiers(item.selectedModifiers),
    })),
  };
}

// ✅ FIXED: Konversi modifiers dengan error handling
function convertModifiers(modifiers: {
  [key: string]: string[];
}): ApiOrderItem["modifiers"] {
  if (!modifiers) return [];

  return Object.entries(modifiers).flatMap(([modId, optionIds]) => {
    if (!optionIds || optionIds.length === 0) return [];

    return optionIds.map((optionId) => ({
      modifier_id: Number(modId),
      option_id: Number(optionId),
    }));
  });
}

// ✅ FIXED: Konversi order dari backend ke frontend dengan type safety
export function apiOrderToOrder(apiOrder: ApiOrder): Order {
  if (!apiOrder) {
    throw new Error("API order cannot be null or undefined");
  }

  return {
    id: apiOrder.id.toString(),
    items: convertOrderItems(apiOrder.items),
    status: validateOrderStatus(apiOrder.status),
    orderType: validateOrderType(apiOrder.order_type),
    tableNumber: apiOrder.table_no,
    totalAmount: apiOrder.total,
    createdAt: new Date(apiOrder.created_at),
  };
}

// ✅ Validasi order status
function validateOrderStatus(status: string): Order["status"] {
  const validStatuses = ["received", "in-progress", "ready", "completed"];
  return validStatuses.includes(status)
    ? (status as Order["status"])
    : "received"; // default value
}

// ✅ Validasi order type
function validateOrderType(orderType: string): Order["orderType"] {
  const validTypes = ["dine-in", "takeaway", "delivery"];
  return validTypes.includes(orderType)
    ? (orderType as Order["orderType"])
    : "dine-in"; // default value
}

// ✅ FIXED: Konversi order items dengan data produk yang benar
function convertOrderItems(items: ApiOrderItem[]): CartItem[] {
  if (!items) return [];

  return items.map((item, index) => ({
    id: `item-${item.product_id}-${Date.now()}-${index}`,
    menuItem: createMenuItemFromOrderItem(item),
    quantity: item.quantity || 1,
    selectedModifiers: convertApiModifiersToCartModifiers(item.modifiers),
    totalPrice: (item.price || 0) * (item.quantity || 1),
  }));
}

// ✅ Buat MenuItem dari order item (placeholder - harus diisi dengan data actual)
function createMenuItemFromOrderItem(item: ApiOrderItem): MenuItem {
  // Ini placeholder - dalam implementasi real, Anda harus fetch product data
  // dari database berdasarkan item.product_id
  return {
    id: item.product_id.toString(),
    name: `Product ${item.product_id}`,
    description: "Product description",
    price: item.price || 0,
    image: "/placeholder.svg",
    category: "coffee",
    modifiers: [],
    isPopular: false,
    isNew: false,
  };
}

// ✅ Konversi API modifiers ke format cart
function convertApiModifiersToCartModifiers(
  apiModifiers?: Array<{
    modifier_id: number;
    option_id: number;
  }>
): { [key: string]: string[] } {
  if (!apiModifiers) return {};

  return apiModifiers.reduce((acc, mod) => {
    const key = mod.modifier_id.toString();
    acc[key] = [...(acc[key] || []), mod.option_id.toString()];
    return acc;
  }, {} as { [key: string]: string[] });
}

// ✅ TEST: Function untuk test Google Drive URLs
export function testGoogleDriveUrls(): void {
  const testUrls = [
    "https://drive.google.com/uc?export=view&id=1FnumgGHhjrNjBmlSjcJtGNfdor0K3n8G",
    "https://drive.google.com/uc?export=view&id=1Pgr9w-RQsTUwmwY0KEn9zJCzR90N-LuC",
    "invalid-url",
    "",
  ];

  console.log("=== Testing Google Drive URL Conversion ===");
  testUrls.forEach((url, index) => {
    console.log(`Test ${index + 1}:`);
    console.log("Original:", url);
    console.log("Converted:", convertGoogleDriveUrl(url));
    console.log("---");
  });
}

// ✅ TEST: Function untuk test image processing
export function testImageProcessing(): void {
  const testImages = [
    "https://drive.google.com/uc?export=view&id=1FnumgGHhjrNjBmlSjcJtGNfdor0K3n8G",
    "data:image/jpeg;base64,invaliddata",
    undefined,
    "/custom-image.jpg",
  ];

  console.log("=== Testing Image Processing ===");
  testImages.forEach((image, index) => {
    console.log(`Test ${index + 1}:`);
    console.log("Input:", image);
    console.log("Output:", processImageUrl(image));
    console.log("---");
  });
}
