"use client"

import { useEffect, useState } from "react"

interface CalendlyWidgetProps {
  url: string
  prefill?: {
    name?: string
    email?: string
    customAnswers?: Record<string, string>
  }
  utm?: {
    utmCampaign?: string
    utmSource?: string
    utmMedium?: string
    utmContent?: string
    utmTerm?: string
  }
}

export function CalendlyWidget({ url, prefill, utm }: CalendlyWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure Calendly script is loaded
    if (typeof window !== "undefined" && (window as any).Calendly) {
      setIsLoaded(true)
    } else {
      // Wait for script to load
      const checkCalendly = setInterval(() => {
        if (typeof window !== "undefined" && (window as any).Calendly) {
          setIsLoaded(true)
          clearInterval(checkCalendly)
        }
      }, 100)

      return () => clearInterval(checkCalendly)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined" && (window as any).Calendly) {
      const calendlyUrl = new URL(url)

      // Add custom parameters
      if (prefill) {
        if (prefill.name) calendlyUrl.searchParams.set("name", prefill.name)
        if (prefill.email) calendlyUrl.searchParams.set("email", prefill.email)
      }

      if (utm) {
        if (utm.utmCampaign) calendlyUrl.searchParams.set("utm_campaign", utm.utmCampaign)
        if (utm.utmSource) calendlyUrl.searchParams.set("utm_source", utm.utmSource)
        if (utm.utmMedium) calendlyUrl.searchParams.set("utm_medium", utm.utmMedium)
        if (utm.utmContent) calendlyUrl.searchParams.set("utm_content", utm.utmContent)
        if (utm.utmTerm) calendlyUrl.searchParams.set("utm_term", utm.utmTerm)
      }

      // Add branding and styling parameters
      calendlyUrl.searchParams.set("hide_gdpr_banner", "1")
      calendlyUrl.searchParams.set("hide_event_type_details", "0")
      calendlyUrl.searchParams.set("background_color", "ffffff")
      calendlyUrl.searchParams.set("text_color", "000000")
      calendlyUrl.searchParams.set("primary_color", "3b82f6")

      // Initialize Calendly widget
      ;(window as any).Calendly.initInlineWidget({
        url: calendlyUrl.toString(),
        parentElement: document.querySelector(".calendly-inline-widget"),
        prefill: prefill || {},
        utm: utm || {},
      })
    }
  }, [isLoaded, url, prefill, utm])

  return null
}
