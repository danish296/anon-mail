"use client"

import { useEffect } from "react"

export function SuppressHydrationWarnings() {
  useEffect(() => {
    // Suppress hydration warnings from browser extensions
    const originalError = console.error
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Extra attributes from the server') ||
         args[0].includes('fdprocessedid') ||
         args[0].includes('Hydration'))
      ) {
        // Suppress these specific warnings
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
