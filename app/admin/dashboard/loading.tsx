"use client"

import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/10 via-[#BEE4E7]/10 to-[#F7CCAD]/10 dark:from-[#FFD4E5]/5 dark:via-[#BEE4E7]/5 dark:to-[#F7CCAD]/5">
      {/* Header skeleton */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-2 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 rounded-2xl overflow-hidden w-16 h-16 md:w-20 md:h-20">
                <div className="w-full h-full bg-gradient-to-br from-[#FFD4E5] to-[#BEE4E7] animate-pulse rounded-2xl" />
              </div>

              <div className="space-y-1">
                <div className="h-5 w-44 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border-2 p-4">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Controls + Add button skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>

          <div className="w-full md:w-auto">
            <div className="h-12 w-44 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto md:mx-0" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="rounded-lg border-2 overflow-hidden">
          <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse" />
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="[&_tr]:border-b">
                  <tr>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <th key={i} className="text-left py-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {Array.from({ length: 6 }).map((_, row) => (
                    <tr key={row} className="border-b">
                      {Array.from({ length: 6 }).map((_, col) => (
                        <td key={col} className="p-2 align-middle">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dialog / form skeleton mimic */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="rounded-lg border-2 p-4">
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}

              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

              <div className="flex gap-2 justify-end mt-4">
                <div className="h-10 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="h-10 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer spinner */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <svg className="mx-auto mb-2 h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
          </svg>
          Cargando panel de administración... <span className="sr-only">Espere mientras cargamos datos</span>
        </div>
      </main>
    </div>
  )
}
