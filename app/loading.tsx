// Reemplaza la función Loading() actual en app/page.tsx por esta
export default function Loading() {
  const cards = Array.from({ length: 8 })

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* HEADER / TÍTULO */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="h-8 w-44 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="mt-2 h-3 w-60 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
        </div>

        {/* SEARCH / FILTROS (móvil y desktop) */}
        <div className="mb-6">
          <div className="mx-auto max-w-3xl">
            <div className="h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto py-2">
            {["", "", "", "", ""].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-8 px-4 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse relative overflow-hidden"
                style={{ minWidth: 110 }}
              >
                <div className="absolute inset-0 shimmer" />
              </div>
            ))}
          </div>
        </div>

        {/* GRID SKELETON (tarjetas de producto) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((_, idx) => (
            <article key={idx} className="rounded-lg bg-card border border-border/40 p-3 space-y-3">
              {/* imagen */}
              <div className="rounded-md overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative">
                <div className="absolute inset-0 animate-pulse" />
                <div className="absolute inset-0 shimmer" />
              </div>

              {/* textos */}
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                  </div>
                  <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA / placeholder inferior */}
        <div className="mt-8">
          <div className="h-12 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse max-w-xl relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>

      {/* Shimmer CSS — uso <style> normal para evitar styled-jsx */}
      <style>{`
        .shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.45) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: translateX(-110%);
          animation: shimmer 1.2s linear infinite;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
      `}</style>
    </main>
  )
}
