import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Baby, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#F490B9] to-[#95C7C3] mb-6">
          <Baby className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Producto no encontrado</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Lo sentimos, el producto que buscas no existe o ha sido eliminado.
        </p>
        <Link href="/">
          <Button className="bg-[#95C7C3] hover:bg-[#95C7C3]/90 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </Link>
      </div>
    </div>
  )
}
