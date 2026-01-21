"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Product, ProductImage } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
import { notify } from "@/lib/notify";

type Props = {
    product?: Product | null;
    existingCategories: string[];
    onClose: () => void;
    onSaved: (action: "created" | "updated", productId?: string) => void;
};

// Type guard para distinguir ProductImage de string
function isProductImage(item: ProductImage | string): item is ProductImage {
    return typeof item !== "string" && typeof (item as ProductImage).image_url === "string";
}

export default function AdminProductForm({ product, existingCategories, onClose, onSaved }: Props) {
    const editingProduct = product ?? null;

    // Inicializar formData con valores seguros
    const [formData, setFormData] = useState({
        name: editingProduct?.name ?? "",
        category: editingProduct?.category ?? "",
        price: editingProduct?.price?.toString() ?? "",
        description: editingProduct?.description ?? "",
        stock: editingProduct?.stock?.toString() ?? "",
        available: editingProduct?.available ?? true,
    });

    // Filtrar SOLO los ProductImage al iniciar el estado (descartar strings)
    const initialExistingImages: ProductImage[] =
        (editingProduct?.images ?? []).filter(isProductImage);

    const [existingImages, setExistingImages] = useState<ProductImage[]>(initialExistingImages);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [removedImages, setRemovedImages] = useState<string[]>([]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    // Selector states
    const [comboOpen, setComboOpen] = useState(false);
    const comboboxRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        // Reset cuando cambie editingProduct: parsear images -> solo ProductImage[]
        setFormData({
            name: editingProduct?.name ?? "",
            category: editingProduct?.category ?? "",
            price: editingProduct?.price?.toString() ?? "",
            description: editingProduct?.description ?? "",
            stock: editingProduct?.stock?.toString() ?? "",
            available: editingProduct?.available ?? true,
        });

        setExistingImages((editingProduct?.images ?? []).filter(isProductImage));
        setSelectedImages([]);
        setRemovedImages([]);
        setIsCustomCategory(false);
        setComboOpen(false);
    }, [editingProduct]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!comboboxRef.current) return;
            if (!comboboxRef.current.contains(e.target as Node)) {
                setComboOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const handleSelectCategory = (cat: string) => {
        setFormData({ ...formData, category: cat });
        setComboOpen(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const removeSelectedImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        const img = existingImages[index];
        if (!img) return;
        if (img.image_url) setRemovedImages((prev) => [...prev, img.image_url]);
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    // sube archivos uno por uno; devuelve array de {url, size}
    const uploadImages = async (files: File[]): Promise<Array<{ url: string | null; size: number; path?: string }>> => {
        const uploaded: Array<{ url: string | null; size: number; path?: string }> = [];

        for (const file of files) {
            const form = new FormData();
            form.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: form,
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type") || "";
                const text = await response.text();
                let serverMsg = text;
                try {
                    if (contentType.includes("application/json")) {
                        const json = JSON.parse(text);
                        serverMsg = json.error || JSON.stringify(json);
                    }
                } catch (e) { }
                throw new Error(`Upload failed (${response.status}): ${serverMsg}`);
            }

            const data = await response.json();
            if (!data) throw new Error("Upload returned empty response");
            uploaded.push({ url: data.url ?? null, size: Number(data.size ?? 0), path: data.path });
        }

        return uploaded;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setUploadingImages(true);

        try {
            // Validaciones
            if (!formData.name.trim()) throw new Error("El nombre es obligatorio");
            if (!formData.category.trim()) throw new Error("La categoría es obligatoria");

            const priceNum = Number.parseFloat(formData.price);
            if (Number.isNaN(priceNum)) throw new Error("Precio inválido");

            const stockNum = formData.stock === "" ? null : Number.parseInt(formData.stock, 10);
            if (formData.stock !== "" && Number.isNaN(stockNum)) throw new Error("Stock inválido");

            // 1) Subir nuevas imágenes (si hay)
            const newImageObjs = selectedImages.length > 0 ? await uploadImages(selectedImages) : [];
            const existingObjs = existingImages.map((img) => ({ url: img.image_url, size: img.size ?? 0, path: undefined }));
            const allImageObjs = [...existingObjs, ...newImageObjs.map((i) => ({ url: i.url, size: i.size }))];

            // Payload
            const productPayload: any = {
                name: formData.name,
                category: formData.category,
                price: priceNum,
                description: formData.description || null,
                stock: stockNum,
                available: Boolean(formData.available),
            };
            if (editingProduct?.id) productPayload.id = editingProduct.id;

            const payload = {
                product: productPayload,
                imageFiles: allImageObjs, // [{url, size}, ...]
            };

            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            let parsed: any = null;
            try {
                parsed = text ? JSON.parse(text) : null;
            } catch {
                throw new Error("El servidor devolvió una respuesta no-JSON al guardar el producto");
            }

            if (!res.ok) {
                console.error("Server-side save failed:", parsed);
                throw new Error(parsed?.error || parsed?.message || "Fallo guardando el producto en el servidor");
            }

            // éxito
            notify("success", editingProduct ? "Producto actualizado" : "Producto creado");
            onSaved(editingProduct ? "updated" : "created", parsed?.product_id ?? parsed?.product?.id);

            // borrar blobs marcados (solo si DB exitoso)
            if (removedImages.length > 0) {
                try {
                    await fetch("/api/upload/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ urls: removedImages }),
                    });
                } catch (delErr) {
                    console.error("Failed to delete removed blobs:", delErr);
                } finally {
                    setRemovedImages([]);
                }
            }
            onClose();
        } catch (err: any) {
            console.error("Error saving product:", err);
            notify("error", "Error al guardar el producto: " + (err?.message ?? String(err)));
            alert("Error al guardar el producto: " + (err?.message ?? String(err)));
        } finally {
            setIsLoading(false);
            setUploadingImages(false);
        }
    };

    return (
        <>
            {/* Reglas CSS globales específicas para el modal de producto */}
            <style jsx global>{`
              /* Aplica sólo dentro de .product-dialog para no afectar otros modales */
              .product-dialog button[aria-label="Close"],
              .product-dialog button[aria-label="close"],
              .product-dialog button[title="Close"],
              .product-dialog button[title="close"],
              .product-dialog button[class*="close"],
              .product-dialog [data-close-button],
              .product-dialog button.absolute,
              .product-dialog button[class*="absolute"] {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
              }
            `}</style>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto product-dialog">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                        {editingProduct ? "Modifica los datos del producto" : "Completa los datos del nuevo producto"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="category">Categoría</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsCustomCategory(!isCustomCategory);
                                    setFormData({ ...formData, category: "" });
                                }}
                                className="text-xs"
                            >
                                {isCustomCategory ? "Seleccionar existente" : "Crear nueva"}
                            </Button>
                        </div>

                        {isCustomCategory ? (
                            <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                placeholder="Escribe una nueva categoría"
                                required
                            />
                        ) : (
                            <div ref={comboboxRef} className="relative">
                                <div className="relative">
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        readOnly
                                        onClick={() => setComboOpen((s) => !s)}
                                        placeholder="Selecciona una categoría"
                                        aria-haspopup="listbox"
                                        aria-expanded={comboOpen}
                                        className="cursor-pointer pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setComboOpen((s) => !s)}
                                        aria-hidden
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    >
                                        <ChevronDown className="opacity-70" size={18} />
                                    </button>
                                </div>

                                {comboOpen && (
                                    <ul
                                        ref={listRef}
                                        role="listbox"
                                        aria-label="Categorías"
                                        className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg border bg-white dark:bg-slate-900 shadow-lg p-1 dark:border-slate-700"
                                    >
                                        {existingCategories.length === 0 ? (
                                            <li className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">No hay categorías</li>
                                        ) : (
                                            existingCategories.map((cat) => (
                                                <li
                                                    key={cat}
                                                    role="option"
                                                    aria-selected={formData.category === cat}
                                                    onClick={() => handleSelectCategory(cat)}
                                                    className={`px-3 py-2 rounded cursor-pointer text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${formData.category === cat ? 'bg-slate-50 dark:bg-slate-800 font-medium' : ''}`}
                                                >
                                                    {cat}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}

                                <input type="hidden" name="category" value={formData.category} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="available"
                            type="checkbox"
                            checked={Boolean(formData.available)}
                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="available" className="mb-0">
                            Disponible
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Imágenes del Producto</Label>
                        <div className="border-2 border-dashed rounded-lg p-4">
                            <Input id="images" type="file" accept="image/*" multiple onChange={handleImageSelect} className="mb-4" />

                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">Imágenes actuales:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {existingImages.map((img, index) => (
                                            <div key={img.id ?? index} className="relative group">
                                                <Image src={img.image_url || "/placeholder.svg"} alt={`Imagen ${index + 1}`} width={100} height={100} className="rounded object-cover w-full h-24" />
                                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExistingImage(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedImages.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Nuevas imágenes ({selectedImages.length}):</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {selectedImages.map((file, index) => (
                                            <div key={index} className="relative group">
                                                <Image src={URL.createObjectURL(file) || "/placeholder.svg"} alt={`Nueva imagen ${index + 1}`} width={100} height={100} className="rounded object-cover w-full h-24" />
                                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSelectedImage(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white" disabled={isLoading}>
                            {isLoading ? (uploadingImages ? "Subiendo imágenes..." : "Guardando...") : editingProduct ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </>
    );
}
