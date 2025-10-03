// components/ui/card.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Share2, Eye } from "lucide-react";
import { useState } from "react";

/* --------------------
   Estructura del Card (presentational)
   -------------------- */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  );
}

/* --------------------
   ViewButton (declaración colocada antes de CardFooter para evitar el error)
   Navega a /producto/{id}, previene propagación del click
   -------------------- */
function ViewButton({ productId }: { productId: string }) {
  const href = `/producto/${encodeURIComponent(productId)}`;
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm bg-muted/60 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1"
      aria-label="Ver producto"
      title="Ver producto"
    >
      <Eye className="h-4 w-4" />
      <span className="hidden sm:inline">Ver</span>
    </Link>
  );
}

/* --------------------
   ShareButton (tipada y colocada antes de CardFooter)
   - acepta productId (obligatorio) y title/text (opcionales)
   -------------------- */
function ShareButton({
  productId,
  title,
  text,
}: {
  productId: string;
  title?: string;
  text?: string;
}) {
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    try {
      return `${location.origin}/producto/${encodeURIComponent(productId)}`;
    } catch (e) {
      return `/producto/${encodeURIComponent(productId)}`;
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const url = buildUrl();
    const shareTitle = title ?? "Ver producto";
    const shareText = text ? `${shareTitle} — ${text}` : `Mira este producto en el catálogo: ${shareTitle}`;

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: shareTitle,
          text: shareText,
          url,
        });
        return;
      } catch (err) {
        // continuar al fallback
      }
    }

    // Fallback: copiar URL al portapapeles
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartir producto"
      className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sm hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-offset-1"
      title="Compartir"
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Compartir</span>
      {copied && <span className="ml-2 text-xs text-muted-foreground">Copiado ✓</span>}
    </button>
  );
}

/* --------------------
   CardFooter: acepta props para compartir y ver
   -------------------- */
type CardFooterProps = React.ComponentProps<"div"> & {
  shareProductId?: number | string | null;
  viewProductId?: number | string | null;
  shareProductTitle?: string | null;
  shareProductText?: string | null;
};

function CardFooter({
  className,
  shareProductId = null,
  viewProductId = null,
  shareProductTitle = null,
  shareProductText = null,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props}>
      {/* contenido habitual a la izquierda + ViewButton al final de la izquierda */}
      <div className="flex items-center gap-3">
        {children}

        {viewProductId != null && (
          <div>
            <ViewButton productId={String(viewProductId)} />
          </div>
        )}
      </div>

      {/* compartido: empuja al final (derecha) */}
      {shareProductId != null && (
        <div className="ml-auto">
          <ShareButton productId={String(shareProductId)} title={shareProductTitle ?? undefined} text={shareProductText ?? undefined} />
        </div>
      )}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ShareButton,
};
