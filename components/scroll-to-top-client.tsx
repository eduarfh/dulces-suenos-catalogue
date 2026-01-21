"use client"

import { useEffect } from "react"

/**
 * Small client component that forces the page to scroll to top on mount.
 * Useful when navigating from an animated catalog to a product detail,
 * ensuring the product page is shown from the top.
 */
export default function ScrollToTopClient() {
  useEffect(() => {
    // wait a frame to allow the initial render/paint, then jump to top
    requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0 })
      } catch (e) {
        // ignore in environments without window
      }
    })
  }, [])

  return null
}
