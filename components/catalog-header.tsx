// components/catalog-header.tsx
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-2 py-2 md:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ajuste: menos padding externo y tamaño fijo del wrapper (responsive) */}
            <div className="p-1 bg-transparent">
              {/* contenedor relativo con w/h controladas; Image usará `fill` */}
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
              <h1 className="text-xl font-bold text-foreground">Dulces Sueños • Store</h1>
              <p className="text-xs text-muted-foreground">Todo para tu bebé</p>
            </div>
          </div>

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
