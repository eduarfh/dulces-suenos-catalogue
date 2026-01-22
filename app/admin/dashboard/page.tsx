"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product, DbProduct, DbProductImage, ProductImage } from "@/lib/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LogOut, Plus, Pencil, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { StorageUsageCard } from "@/components/admin/storage-usage-card";
import AdminProductForm from "@/components/admin/product-form";
import { ToastContainer } from "@/components/toast";
import { notify } from "@/lib/notify";
import AdminStoreForm from "@/components/admin/store-form";

export default function AdminDashboard() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // estado para el modal de configuración (store)
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);

  const existingCategories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category ?? "")));
    return uniqueCategories.filter(Boolean).sort();
  }, [products]);

  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // cerrar modal de store cuando el propio formulario publica el evento
  useEffect(() => {
    const onUpdated = () => setIsStoreDialogOpen(false);
    window.addEventListener("store-info:updated", onUpdated);
    return () => window.removeEventListener("store-info:updated", onUpdated);
  }, []);

  const loadProducts = async () => {
    const supabase = createClient();

    const { data: dbProducts } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    const { data: dbImages } = await supabase
      .from("product_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (dbProducts) {
      const productsWithImages: Product[] = dbProducts.map((product: DbProduct) => {
        const productImages: ProductImage[] = (dbImages || [])
          .filter((img: DbProductImage) => img.product_id === product.id)
          .map((img: DbProductImage) => ({
            id: img.id,
            product_id: img.product_id,
            image_url: img.image_url,
            display_order: img.display_order,
            created_at: img.created_at,
            size: img.size ?? null,
          }));

        const normalizedPrice =
          typeof (product as any).price === "number"
            ? (product as any).price
            : Number(product.price ?? 0) || 0;

        const normalizedStock =
          product.stock == null ? 0 : Number(product.stock) || 0;

        return {
          id: product.id,
          name: product.name ?? "",
          category: product.category ?? "",
          price: normalizedPrice,
          description: product.description ?? null,
          stock: normalizedStock,
          images: productImages,
          created_at: product.created_at,
          updated_at: product.updated_at,
          available: Boolean((product as any).available ?? true),
        };
      });

      productsWithImages.forEach((p) => {
        if (p.price == null || Number.isNaN(p.price)) console.warn("Product with invalid price:", p.id, p.name);
        if (p.stock == null || Number.isNaN(p.stock)) console.warn("Product with invalid stock:", p.id, p.name);
      });

      setProducts(productsWithImages);
    } else {
      setProducts([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    router.push("/admin/login");
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormDataForDialog(product);
    } else {
      setEditingProduct(null);
      setFormDataForDialog(null);
    }
    setIsDialogOpen(true);
  };

  const setFormDataForDialog = (product?: Product | null) => {
    if (product) {
      setEditingProduct({
        ...product,
        price: product.price ?? 0,
        stock: product.stock ?? 0,
      } as Product);
    } else {
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setIsLoading(true);
    try {
      const supabase = createClient();

      let imageUrls: string[] = [];
      const localProduct = products.find((p) => p.id === id);
      if (localProduct && Array.isArray(localProduct.images) && localProduct.images.length > 0) {
        imageUrls = localProduct.images.map((i) => (typeof i === "string" ? i : (i as ProductImage).image_url)).filter(Boolean);
      } else {
        const imgsRes = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", id)
          .order("display_order", { ascending: true });

        const imgs = (imgsRes as any).data as Array<{ image_url: string }> | null;
        const imgsErr = (imgsRes as any).error;

        if (imgsErr) {
          console.error("Error fetching product_images before delete:", imgsErr);
        } else if (imgs && imgs.length > 0) {
          imageUrls = imgs.map((r) => r.image_url).filter(Boolean);
        }
      }

      imageUrls = Array.from(new Set(imageUrls.filter(Boolean)));

      if (imageUrls.length > 0) {
        const delImgsRes = await supabase.from("product_images").delete().eq("product_id", id);
        if ((delImgsRes as any).error) {
          console.error("Error deleting product_images rows:", (delImgsRes as any).error);
        }
      }

      const delProdRes = await supabase.from("products").delete().eq("id", id);
      if ((delProdRes as any).error) {
        console.error("Error deleting product row:", (delProdRes as any).error);
        alert("Error al eliminar el producto en la base de datos.");
        return;
      }

      if (imageUrls.length > 0) {
        try {
          await fetch("/api/upload/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: imageUrls }),
          });
        } catch (blobErr) {
          console.error("Failed to delete product images from blob store:", blobErr);
        }
      }

      await loadProducts();
      if (typeof window !== "undefined") window.dispatchEvent(new Event("storage:refresh"));
    } catch (err) {
      console.error("handleDelete unexpected error:", err);
      alert("Ocurrió un error al eliminar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
  const lowStock = products.filter((p) => (Number(p.stock) || 0) < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      <ToastContainer />

      {/* reglas CSS globales dirigidas exclusivamente al modal de configuración */}
      <style jsx global>{`
        /* Clase aplicada en DialogContent: .store-dialog */
        /* Oculta botones "close" posicionales (X) dentro del modal de configuración. */
        .store-dialog button[aria-label="Close"],
        .store-dialog button[aria-label="close"],
        .store-dialog button[title="Close"],
        .store-dialog button[title="close"],
        .store-dialog button[class*="close"],
        .store-dialog [data-close-button],
        /* botones posicionales (generalmente la X es absolute) */
        .store-dialog button.absolute,
        .store-dialog button[class*="absolute"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">

        <div className="container mx-auto px-2 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-1 bg-transparent">
                <div className="relative flex-shrink-0 rounded-2xl overflow-hidden w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24">
                  <Image
                    src="https://bypjbkhezrokhksjxfri.supabase.co/storage/v1/object/public/catalogo/logo%20recortado.jpg"
                    alt="Logo Dulces Sueños"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
                <p className="text-xs text-muted-foreground">Gestión de productos</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle />

              {/* Botón de configuración que abre modal fullscreen/responsive */}
              <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                {/* 
                  Aplicamos la clase `store-dialog` para scopear las reglas CSS de más arriba.
                  Esto ocultará la "X" pero dejará el botón textual "Cerrar".
                */}
                <DialogContent className="sm:max-w-3xl max-w-full store-dialog">
                  <DialogHeader>
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <DialogTitle className="text-lg font-semibold">Configuración de la tienda</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          Edita los datos que se muestran en la tienda y el contacto.
                        </DialogDescription>
                      </div>

                      <div className="ml-4">
                        <Button variant="ghost" size="sm" onClick={() => setIsStoreDialogOpen(false)}>
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-4">
                    <AdminStoreForm />
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 order-2 md:order-1 mt-6 md:mt-0">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#95C7C3]">{totalProducts}</div>
            </CardContent>
          </Card>

          <StorageUsageCard />
        </div>

        {/* NOTE: retiré el AdminStoreForm inline; ahora se abre desde el botón de configuración en el header */}

        <Card className="border-2 order-1 md:order-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Productos</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()} className="bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </DialogTrigger>

                {/* AdminProductForm ya exporta DialogContent internamente, por eso lo usamos directamente */}
                <AdminProductForm
                  product={editingProduct}
                  existingCategories={existingCategories}
                  onClose={() => setIsDialogOpen(false)}
                  onSaved={async (action, id) => {
                    await loadProducts();
                    notify("success", action === "created" ? "Producto creado" : "Producto actualizado");
                    setIsDialogOpen(false);
                  }}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Imágenes</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#BEE4E7] text-gray-800 dark:text-gray-900">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell>${(Number(product.price) || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={(Number(product.stock) || 0) < 10 ? "text-red-600 dark:text-red-400 font-semibold" : ""}>
                          {product.stock ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {(product.images || []).length} imagen{(product.images || []).length !== 1 ? "es" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => handleOpenDialog(product)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
