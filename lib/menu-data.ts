export interface MenuItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  is_available: boolean;
  category_id: number;
  image_url?: string;
}

// URL backend kamu (ubah sesuai alamat Go server)
const API_URL = "http://localhost:8080/products";

// Ambil semua produk dari backend
export async function fetchMenuData(): Promise<MenuItem[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: MenuItem[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
}
