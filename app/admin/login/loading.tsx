"use client"

import React from "react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFD4E5]/20 via-[#BEE4E7]/20 to-[#F7CCAD]/20 dark:from-[#FFD4E5]/10 dark:via-[#BEE4E7]/10 dark:to-[#F7CCAD]/10 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" aria-hidden />
      </div>

      <div className="w-full max-w-md">
        <div className="mx-auto mb-6">
          <div className="relative rounded-2xl overflow-hidden w-24 h-24 mx-auto">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#FFD4E5] to-[#BEE4E7] animate-pulse" />
          </div>
        </div>

        <div className="rounded-lg border-2 bg-card p-6">
          <div className="mb-4 text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse" />
          </div>

          <form className="space-y-4" aria-hidden>
            <div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            </div>
          </form>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
              </svg>
              <span className="text-sm text-muted-foreground">Verificando credenciales…</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              <div className="h-3 w-36 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
            </div>
            <div className="mt-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-xs text-muted-foreground">
              <span className="sr-only">Cargando página de inicio de sesión</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}
