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

export default function BackToCatalogButton({
  className = "",
  label = "Volver al Catálogo",
  compact = false,
  ariaLabel,
}: Props) {
  return (
    <Button
      asChild
      variant="ghost"
      size={compact ? "sm" : "sm"}
      className={`
        rounded-lg
        shadow-sm shadow-[rgba(2,6,23,0.06)]
        focus-visible:ring-4 focus-visible:ring-[var(--color-ring)]/25
        disabled:opacity-100 disabled:pointer-events-none
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
          text-muted-foreground hover:text-foreground dark:text-white
          bg-primary/5 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1 border border-[color:var(--color-border)] dark:border-[color:var(--sidebar-border)]
          rounded-lg
          relative
        `}
      >

        <span className="leading-none color-white">{label}</span>
      </Link>
    </Button>
  );
}
