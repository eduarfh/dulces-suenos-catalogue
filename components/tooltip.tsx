// components/ui/tooltip.tsx
"use client";

import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "right" | "bottom" | "left";
  delay?: number; // ms before showing (CSS transitionDelay)
  className?: string;
}

/**
 * CSS-only + accesible:
 * - se muestra en hover y focus-within (soporta teclado)
 * - usa role="tooltip" y aria-describedby (useId)
 * - admite delay por prop
 */
export function Tooltip({
  children,
  content,
  placement = "top",
  delay = 0,
  className = "",
}: TooltipProps) {
  const id = React.useId();

  const placementClass =
    placement === "top"
      ? "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
      : placement === "bottom"
      ? "top-full left-1/2 transform -translate-x-1/2 mt-2"
      : placement === "left"
      ? "right-full top-1/2 transform -translate-y-1/2 mr-2"
      : /* right */ "left-full top-1/2 transform -translate-y-1/2 ml-2";

  return (
    <span className={`relative inline-block group ${className}`} tabIndex={0} aria-describedby={id}>
      {children}

      <span
        id={id}
        role="tooltip"
        // pointer-events-none evita que el tooltip interfiera con el mouse
        className={`
          pointer-events-none absolute z-50
          ${placementClass}
          whitespace-nowrap rounded-md px-2 py-1 text-xs
          bg-[color:var(--color-foreground)]/95 text-[color:var(--color-card-foreground)]
          opacity-0 translate-y-1 scale-95
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100
          transition-all duration-150 ease-out
        `}
        style={{ transitionDelay: `${delay}ms` }}
        aria-hidden={false}
      >
        <span className="leading-tight">{content}</span>

        {/* flechita */}
        <span
          className={`
            block absolute
            ${placement === "top" ? "top-full left-1/2 -translate-x-1/2" : ""}
            ${placement === "bottom" ? "bottom-full left-1/2 -translate-x-1/2" : ""}
            ${placement === "left" ? "left-full top-1/2 -translate-y-1/2" : ""}
            ${placement === "right" ? "right-full top-1/2 -translate-y-1/2" : ""}
            w-2 h-2
            bg-[color:var(--color-foreground)]/95
            rotate-45
            transform
          `}
          aria-hidden
        />
      </span>
    </span>
  );
}

export default Tooltip;
