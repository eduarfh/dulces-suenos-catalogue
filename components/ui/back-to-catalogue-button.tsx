// components/back-to-catalog-button.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
  label?: string;
  compact?: boolean;
  ariaLabel?: string;
};

/**
 * Botón "Volver al Catálogo" que usa `Button asChild` para mantener semántica <a>
 * y mezcla el estilo con las variables del catálogo (globals.css).
 */
export default function BackToCatalogButton({
  className = "",
  label = "Volver al Catálogo",
  compact = false,
  ariaLabel,
}: Props) {
  return (
    <Button
      asChild
      variant="default"
      size={compact ? "sm" : "sm"}
      className={`
        relative overflow-hidden rounded-lg
        shadow-sm shadow-[rgba(2,6,23,0.06)]
        transition-transform duration-150 ease-out
        hover:-translate-y-[2px] hover:shadow-md
        focus-visible:ring-4 focus-visible:ring-[var(--color-ring)]/25
        disabled:opacity-60 disabled:pointer-events-none
        ${className}
      `}
      aria-label={ariaLabel ?? label}
    >
      {/* asChild -> el <a> recibe los props y ref */}
      <Link
        href="/"
        className={`
          inline-flex items-center gap-2
          px-3 py-2
          font-medium
        text-[var(--color-primary-foreground)] dark:text-white
          /* gradient que usa las variables de tu tema (funciona en light & dark) */
          bg-[linear-gradient(90deg,var(--color-sidebar-primary),var(--color-sidebar-accent))]
          bg-[var(--color-primary)]
          rounded-lg
          relative
        `}
      >

        <span className="leading-none color-white">{label}</span>

        {/* brillo sutil encima (solo visual) */}
        {/* <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-30 transition-opacity duration-200"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.12) 45%, rgba(247, 219, 219, 0.02) 100%)",
            mixBlendMode: "overlay",
          }}
        /> */}
      </Link>
    </Button>
  );
}
