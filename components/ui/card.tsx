// components/ui/card.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Share2, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/* ---------- Analytics helper ---------- */
const trackEvent = (name: string, params: Record<string, any> = {}) => {
  try {
    if (typeof window !== "undefined") {
      if ((window as any).gtag && typeof (window as any).gtag === "function") {
        try {
          (window as any).gtag("event", name, params);
        } catch (err) {
          // noop
        }
      }
      try {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({ event: name, ...params });
      } catch (err) {
        // noop
      }
    }
  } catch (err) {
    // noop
  } finally {
    // debug fallback
    // eslint-disable-next-line no-console
    console.debug("[trackEvent]", name, params);
  }
};

/* --------------------
   Presentational Card pieces
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

/* Common button sizing for icon/compact consistency */
const BUTTON_SIZE_CLASSES = "inline-flex items-center justify-center rounded-md px-3 py-2 text-base sm:text-sm";

/* --------------------
   ViewButton (same sizing)
   -------------------- */
function ViewButton({ productId }: { productId: string }) {
  const href = `/producto/${encodeURIComponent(productId)}`;
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent("view_button_click", { productId });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`${BUTTON_SIZE_CLASSES} bg-primary/5 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1 border border-[color:var(--color-border)] dark:border-[color:var(--sidebar-border)]`}
      aria-label="Ver producto"
      title="Ver producto"
    >
      <Eye className="h-5 w-5 sm:h-5 sm:w-5" />
      <span className="sr-only sm:not-sr-only ml-2">Ver</span>
    </Link>
  );
}

/* --------------------
   ShareButton (same sizing)
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
    } catch {
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
        trackEvent("share_button_click", { productId, method: "native" });
        return;
      } catch {
        // fallback
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
        trackEvent("share_button_click", { productId, method: "clipboard" });
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
        trackEvent("share_button_click", { productId, method: "clipboard_fallback" });
      }
    } catch (err) {
      window.open(url, "_blank");
      trackEvent("share_button_click", { productId, method: "fallback_open" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartir producto"
      className={`${BUTTON_SIZE_CLASSES} bg-primary/5 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1 border border-[color:var(--color-border)] dark:border-[color:var(--sidebar-border)]`}
      title="Compartir"
    >
      <Share2 className="h-5 w-5 sm:h-5 sm:w-5" />
      <span className="sr-only sm:not-sr-only ml-2">Compartir</span>
      {copied && <span className="ml-2 text-xs text-muted-foreground">Copiado ✓</span>}
    </button>
  );
}

/* --------------------
   WhatsAppContactButton (PORTAL + positioning)
   - Renderiza el popover en document.body para evitar clipping y stacking issues.
   - Posiciona el popover usando getBoundingClientRect del botón.
   - Actualiza posicionamiento al hacer scroll / resize.
   -------------------- */
function WhatsAppContactButton({
  productId,
  title,
  text,
  numbers = ["+53 55550301", "+53 54499134"],
}: {
  productId: string;
  title?: string;
  text?: string;
  numbers?: string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; right: number } | null>(null);

  const buildUrl = () => {
    try {
      return `${location.origin}/producto/${encodeURIComponent(productId)}`;
    } catch {
      return `/producto/${encodeURIComponent(productId)}`;
    }
  };

  const sanitizePhone = (raw: string) => raw.replace(/[^\d]/g, "");

  const handleChoose = (rawNumber: string) => {
    const phone = sanitizePhone(rawNumber);
    const url = buildUrl();
    const productLabel = title ?? productId;
    const brandLabel = text ?? "";
    const message = `Hola, estoy interesado en ${productLabel}${brandLabel ? ` - ${brandLabel}` : ""}. ${url}`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    trackEvent("whatsapp_number_selected", { productId, phone, method: "wa.me" });
    window.open(waUrl, "_blank");
    setOpen(false);
  };

  const calculateAndSetCoords = () => {
    const btn = rootRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    const top = rect.bottom + scrollY + 8; // 8px gap
    let left = rect.left + scrollX;
    // menu width estimate (same as previous w-56)
    const menuWidth = 224;
    if (left + menuWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuWidth - 8);
    }
    setCoords({ top, left, right: rect.right + scrollX });
  };

  useEffect(() => {
    if (open) {
      calculateAndSetCoords();
      const onScroll = () => calculateAndSetCoords();
      const onResize = () => calculateAndSetCoords();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("click", handleOutsideClick);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("click", handleOutsideClick);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleOutsideClick = (e: MouseEvent) => {
    const portalEl = document.getElementById(`wa-popover-${productId}`);
    if (!portalEl) {
      setOpen(false);
      return;
    }
    if (rootRef.current && rootRef.current.contains(e.target as Node)) return;
    if (!portalEl.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => {
      const next = !v;
      if (!v && next) {
        trackEvent("whatsapp_button_open", { productId });
      }
      return next;
    });
  };

  /* WhatsApp SVG (simple, inline) */
  const WhatsAppSVG = (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .06 5.31.06 11.93 0 14.18.55 16.32 1.6 18.18L0 24l6.04-1.58A11.9 11.9 0 0012 23.86c6.63 0 11.94-5.31 11.94-11.93 0-3.19-1.21-6.19-3.42-8.45z"
        fill="#25D366"
      />
      <path
        d="M17.06 14.38c-.29-.14-1.71-.84-1.98-.93-.27-.09-.47-.14-.67.14s-.77.93-.95 1.12c-.18.19-.36.21-.66.07-.3-.14-1.27-.47-2.41-1.48-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.13-.6.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.38-.01-.53-.02-.14-.67-1.6-.92-2.2-.24-.57-.49-.49-.67-.5-.17-.01-.36-.01-.55-.01s-.51.07-.78.36c-.27.29-1.04 1.02-1.04 2.48 0 1.45 1.06 2.86 1.21 3.06.15.2 2.08 3.35 5.03 4.7 2.95 1.35 2.95.9 3.48.85.53-.05 1.71-.7 1.95-1.38.24-.69.24-1.28.17-1.39-.07-.11-.27-.17-.57-.31z"
        fill="#fff"
      />
    </svg>
  );

  // Portal content
  const portal = coords && open ? (
    <div
      id={`wa-popover-${productId}`}
      // high z-index and fixed/absolute positioning relative to page
      style={{ position: "absolute", top: coords.top, left: coords.left, zIndex: 99999 }}
      // note: keep same width as previous `w-56` (224px)
    >
      <div className="w-56 rounded-md border bg-popover shadow-lg py-2" onClick={(e) => e.stopPropagation()}>
        <div className="px-3 text-xs text-muted-foreground">Contactar a:</div>
        <div className="mt-1">
          {numbers.map((n) => (
            <button
              key={n}
              onClick={(ev) => {
                ev.stopPropagation();
                handleChoose(n);
              }}
              className="w-full text-left px-3 py-2 hover:bg-muted/60 text-sm"
              role="menuitem"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={rootRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Contactar por WhatsApp"
        title="Contactar por WhatsApp"
        className={`${BUTTON_SIZE_CLASSES} bg-primary/5 hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1 border border-[color:var(--color-border)] dark:border-[color:var(--sidebar-border)]`}
        onMouseDown={(e) => e.preventDefault()}
      >
        <span className="h-5 w-5 block">{WhatsAppSVG}</span>
      </button>

      {/* Render portal into document.body so menu is never clipped by parent cards */}
      {typeof document !== "undefined" && portal ? createPortal(portal, document.body) : null}
    </>
  );
}

/* --------------------
   CardFooter: show Share then WhatsApp at right (icon-only)
   -------------------- */
type CardFooterProps = React.ComponentProps<"div"> & {
  shareProductId?: number | string | null;
  viewProductId?: number | string | null;
  shareProductTitle?: string | null;
  shareProductText?: string | null;
  showWhatsApp?: boolean | null; // if null/undefined -> true by default
  whatsappNumbers?: string[] | null;
};

function CardFooter({
  className,
  shareProductId = null,
  viewProductId = null,
  shareProductTitle = null,
  shareProductText = null,
  showWhatsApp = null,
  whatsappNumbers = null,
  children,
  ...props
}: CardFooterProps) {
  const shouldShowWhatsApp = showWhatsApp === null ? shareProductId != null : showWhatsApp === true;

  return (
    <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props}>
      {/* left area */}
      <div className="flex items-center gap-3">
        {children}
        {viewProductId != null && (
          <div>
            <ViewButton productId={String(viewProductId)} />
          </div>
        )}
      </div>

      {/* right: share + whatsapp */}
      {shareProductId != null && (
        <div className="ml-auto flex items-center gap-2">
          <ShareButton
            productId={String(shareProductId)}
            title={shareProductTitle ?? undefined}
            text={shareProductText ?? undefined}
          />
          {shouldShowWhatsApp && (
            <WhatsAppContactButton
              productId={String(shareProductId)}
              title={shareProductTitle ?? undefined}
              text={shareProductText ?? undefined}
              numbers={whatsappNumbers ?? ["+53 55550301", "+53 54499134"]}
            />
          )}
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
  WhatsAppContactButton,
};
