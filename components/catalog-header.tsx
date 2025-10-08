//components/catalog-header.tsx
import { Baby } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function CatalogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#F490B9] to-[#95C7C3] p-2 rounded-xl">
              <Baby className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Baby Store</h1>
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
