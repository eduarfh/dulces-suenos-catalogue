"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Product, DbProduct, DbProductImage } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Baby, LogOut, Plus, Pencil, Trash2, X } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  const existingCategories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))
    return uniqueCategories.sort()
  }, [products])

  useEffect(() => {
    const auth = localStorage.getItem("isAdminAuthenticated")
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadProducts()
    }
  }, [router])

  const loadProducts = async () => {
    const supabase = createClient()

    const { data: dbProducts } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    const { data: dbImages } = await supabase
      .from("product_images")
      .select("*")
      .order("display_order", { ascending: true })

    if (dbProducts) {
      const productsWithImages: Product[] = dbProducts.map((product: DbProduct) => {
        const productImages = (dbImages || [])
          .filter((img: DbProductImage) => img.product_id === product.id)
          .map((img: DbProductImage) => img.image_url)

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          stock: product.stock,
          images: productImages,
          created_at: product.created_at,
          updated_at: product.updated_at,
        }
      })
      setProducts(productsWithImages)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    router.push("/admin/login")
  }

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        stock: product.stock.toString(),
      })
      setExistingImages(product.images)
      setIsCustomCategory(!existingCategories.includes(product.category))
    } else {
      setEditingProduct(null)
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "",
      })
      setExistingImages([])
      setIsCustomCategory(false)
    }
    setSelectedImages([])
    setIsDialogOpen(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files))
    }
  }

  const removeSelectedImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        uploadedUrls.push(data.url)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadingImages(true)

    try {
      const supabase = createClient()

      // Upload new images
      const newImageUrls = await uploadImages(selectedImages)
      const allImageUrls = [...existingImages, ...newImageUrls]

      if (editingProduct) {
        // Update existing product
        const { error: productError } = await supabase
          .from("products")
          .update({
            name: formData.name,
            category: formData.category,
            price: Number.parseFloat(formData.price),
            description: formData.description,
            stock: Number.parseInt(formData.stock),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)

        if (productError) throw productError

        // Delete all existing images
        await supabase.from("product_images").delete().eq("product_id", editingProduct.id)

        // Insert new images
        if (allImageUrls.length > 0) {
          const imageRecords = allImageUrls.map((url, index) => ({
            product_id: editingProduct.id,
            image_url: url,
            display_order: index,
          }))

          await supabase.from("product_images").insert(imageRecords)
        }
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            name: formData.name,
            category: formData.category,
            price: Number.parseFloat(formData.price),
            description: formData.description,
            stock: Number.parseInt(formData.stock),
          })
          .select()
          .single()

        if (productError) throw productError

        // Insert images
        if (allImageUrls.length > 0) {
          const imageRecords = allImageUrls.map((url, index) => ({
            product_id: newProduct.id,
            image_url: url,
            display_order: index,
          }))

          await supabase.from("product_images").insert(imageRecords)
        }
      }

      await loadProducts()
      setIsDialogOpen(false)
      setIsCustomCategory(false)
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error al guardar el producto")
    } finally {
      setIsLoading(false)
      setUploadingImages(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    const supabase = createClient()
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    } else {
      await loadProducts()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const lowStock = products.filter((p) => p.stock < 10).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#F490B9] to-[#95C7C3] p-2 rounded-xl">
                <Baby className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Panel de Administración</h1>
                <p className="text-xs text-muted-foreground">Gestión de productos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" size="sm">
                  Ver Catálogo
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#95C7C3]">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#F490B9]">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#F49F51]">{lowStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="border-2">
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                            setIsCustomCategory(!isCustomCategory)
                            setFormData({ ...formData, category: "" })
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
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="images">Imágenes del Producto</Label>
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageSelect}
                          className="mb-4"
                        />

                        {/* Existing images */}
                        {existingImages.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Imágenes actuales:</p>
                            <div className="grid grid-cols-4 gap-2">
                              {existingImages.map((url, index) => (
                                <div key={index} className="relative group">
                                  <Image
                                    src={url || "/placeholder.svg"}
                                    alt={`Imagen ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="rounded object-cover w-full h-24"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeExistingImage(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New images preview */}
                        {selectedImages.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Nuevas imágenes ({selectedImages.length}):</p>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedImages.map((file, index) => (
                                <div key={index} className="relative group">
                                  <Image
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={`Nueva imagen ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="rounded object-cover w-full h-24"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeSelectedImage(index)}
                                  >
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? uploadingImages
                            ? "Subiendo imágenes..."
                            : "Guardando..."
                          : editingProduct
                            ? "Guardar Cambios"
                            : "Crear Producto"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
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
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock < 10 ? "text-red-600 dark:text-red-400 font-semibold" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {product.images.length} imagen{product.images.length !== 1 ? "es" : ""}
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
  )
}
