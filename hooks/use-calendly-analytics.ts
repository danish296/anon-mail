"use client"

import { useEffect } from "react"

export function useCalendlyAnalytics() {
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf("calendly") === 0) {
        // Google Analytics tracking
        if (typeof window !== "undefined" && (window as any).gtag) {
          const eventData = e.data.event_details || {}

          switch (e.data.event) {
            case "calendly.profile_page_viewed":
              ;(window as any).gtag("event", "calendly_profile_viewed", {
                event_category: "calendly",
                event_label: "demo_booking_started",
              })
              break

            case "calendly.date_and_time_selected":
              ;(window as any).gtag("event", "calendly_time_selected", {
                event_category: "calendly",
                event_label: "demo_booking_progress",
                value: 1,
              })
              break

            case "calendly.event_scheduled":
              ;(window as any)
                .gtag("event", "calendly_booking_completed", {
                  event_category: "conversion",
                  event_label: "demo_booking_success",
                  value: 10,
                })(
                  // Track conversion for ads
                  window as any,
                )
                .gtag("event", "conversion", {
                  send_to: "AW-CONVERSION_ID/CONVERSION_LABEL", // Replace with actual conversion ID
                  value: 1.0,
                  currency: "USD",
                })
              break

            case "calendly.event_type_viewed":
              ;(window as any).gtag("event", "calendly_event_viewed", {
                event_category: "calendly",
                event_label: eventData.event_type_name || "demo",
              })
              break
          }
        }

        // Facebook Pixel tracking
        if (typeof window !== "undefined" && (window as any).fbq) {
          switch (e.data.event) {
            case "calendly.event_scheduled":
              ;(window as any).fbq("track", "Schedule", {
                content_name: "Demo Booking",
                content_category: "Lead Generation",
              })
              break
          }
        }

        // Custom analytics or CRM integration
        if (typeof window !== "undefined" && (window as any).analytics) {
          ;(window as any).analytics.track(e.data.event, {
            ...e.data.event_details,
            source: "calendly_widget",
          })
        }
      }
    }

    window.addEventListener("message", handleCalendlyEvent)
    return () => window.removeEventListener("message", handleCalendlyEvent)
  }, [])
}
