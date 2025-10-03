// app/producto/[id]/loading.tsx
export default function LoadingProductoPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* ---------- MOBILE COMPACT SKELETON (visible en < md) ---------- */}
        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="w-2/3">
              <div className="h-7 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="mt-1 h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-28 h-28 rounded-md bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-3 w-2/3 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />

              <div className="pt-2 border-t border-border/30">
                <div className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-2 space-y-1">
                  <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- DESKTOP / TABLET SKELETON (visible md and up) ---------- */}
        <div className="hidden md:block">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="w-2/3">
              <div className="h-8 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="mt-2 h-4 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-6 w-28 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-4">
              <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative aspect-square animate-pulse" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <div className="h-3 w-40 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-3 h-8 w-48 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>

              <div>
                <div className="h-3 w-56 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-3 h-6 w-40 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>

              <section className="pt-4 border-t">
                <div className="h-4 w-36 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-5/6 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-4/6 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
