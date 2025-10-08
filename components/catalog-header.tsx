// components/catalog-header.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* Contenedor del logo: sin degradado, sólo borde sutil y esquinas redondeadas */}
            <div className="mx-auto to-[#95C7C3] p-4 rounded-2xl w-fit overflow-hidden bg-transparent">
              <Image
                // pon aquí tu archivo (recomiendo renombrar sin espacios)
                src="/logo%20recortado.jpg" // o "/logo%20recortado.jpg"
                alt="Logo Dulces Sueños"
                width={32}    // tamaño base (coincide con h-8)
                height={32}
                className="h-30 w-30 sm:h-30 sm:w-30 object-contain block"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-foreground">Dulces Sueños • Store</h1>
              <p className="text-xs text-muted-foreground">Todo para tu bebé</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="border-[#95C7C3] text-[#95C7C3] hover:bg-[#95C7C3] hover:text-white bg-transparent"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
