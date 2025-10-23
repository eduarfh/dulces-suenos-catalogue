// lib/products.ts
export interface ProductImage {
  id?: string;
  product_id?: string;
  image_url: string;
  display_order?: number;
  created_at?: string;
  size?: number | null; // bytes
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: ProductImage[]; // ahora es array de objetos
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface DbProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  size?: number | null;
}
