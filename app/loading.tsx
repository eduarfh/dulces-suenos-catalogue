"use client"

import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      {/* Header skeleton (no server imports so we mirror the header look) */}
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

      <main className="container mx-auto px-4 py-8">
        {/* Hero / Search area */}
        <div className="text-center mb-8">
          <div className="mx-auto max-w-2xl">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
          <div className="col-span-2">
            <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="col-span-1 flex gap-2">
            <div className="h-12 flex-1 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-12 w-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Category pills skeleton */}
        <div className="mb-8 flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded-full bg-gray-200 dark:bg-gray-700 px-4 py-1 animate-pulse w-[120px]" />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="rounded-lg border-2 overflow-hidden p-0 bg-card">
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#FFD4E5]/20 to-[#BEE4E7]/20">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>

              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3 animate-pulse" />

                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer-ish loading hint */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <svg className="mx-auto mb-2 h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
          </svg>
          Cargando catálogo... <span className="sr-only">Espere mientras cargamos los productos</span>
        </div>
      </main>
    </div>
  )
}
