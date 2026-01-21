"use client"

import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      <div className="w-full max-w-6xl">
        {/* Hero skeleton */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container mx-auto px-2 py-2 md:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0 rounded-2xl overflow-hidden w-12 h-12 md:w-20 md:h-20">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#FFD4E5] to-[#BEE4E7] animate-pulse" />
                </div>

                <div className="space-y-1">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Large image + details skeleton */}
          <div className="rounded-lg overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20 p-4">
            <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
          </div>

          {/* Right column skeleton blocks */}
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border-2 p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>

            <div className="rounded-lg border-2 p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse mb-3" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-2">
              <svg className="mx-auto mb-2 h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
              </svg>
              Cargando producto... <span className="sr-only">Espere mientras cargamos los datos del producto</span>
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Productos relacionados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border-2 p-4 bg-card animate-pulse">
                <div className="aspect-square rounded-md bg-gray-200 dark:bg-gray-800 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
