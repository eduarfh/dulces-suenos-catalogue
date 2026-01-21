// lib/products.ts
// Tipos compartidos entre servidor / cliente para productos e imágenes.
// Ajustados para evitar errores de asignación entre ProductImage[] y string[],
// y para exponer la propiedad `available` obligatoria en Product.

export type DbProduct = {
  id: string;
  name: string;
  category: string;
  // En la DB numeric puede venir como number o string según cliente/driver
  price: number | string;
  description: string | null;
  stock: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  available?: boolean | null;
};

export type DbProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at?: string | null;
  size?: number | null;
};

export type ProductImage = DbProductImage;

// Product usado en la UI. `images` admite tanto ProductImage (registro DB)
// como string (URL simple) para compatibilidad con distintas partes de la app.
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  stock: number | null;
  // Puede ser array de objetos ProductImage (admin) o array de strings (frontend/detail).
  images: Array<ProductImage | string>;
  created_at?: string | null;
  updated_at?: string | null;
  available: boolean;
};

// Tipos auxiliares si necesitas importarlos
export type Price = number;
