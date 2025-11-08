"use client"

import { useEffect, useState } from "react"
import { X, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [showIframe, setShowIframe] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  const openCalendlyDirect = () => {
    window.open("https://calendly.com/echorift-ai", "_blank", "noopener,noreferrer")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/15 dark:bg-primary/25 text-primary shadow-sm ring-1 ring-primary/10">
              <Calendar className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Schedule Your Demo</h2>
              <p className="text-sm text-muted-foreground">Book a 30-minute meeting with our team</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Backup Button - Always visible */}
          <div className="mb-4 text-center">
            <Button onClick={openCalendlyDirect} size="lg" className="w-full max-w-sm">
              <ExternalLink className="size-4 mr-2" />
              Open Calendar in New Tab
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Click above if the calendar below doesn't load</p>
          </div>

          {/* Simple iframe */}
          {showIframe && (
            <div className="border border-border rounded-lg overflow-hidden">
              <iframe
                src="https://calendly.com/echorift-ai"
                width="100%"
                height="600"
                frameBorder="0"
                title="Schedule a meeting"
                onError={() => setShowIframe(false)}
                style={{
                  minWidth: "320px",
                  background: "white",
                }}
              />
            </div>
          )}

          {/* Fallback content if iframe fails */}
          {!showIframe && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-primary/15 dark:bg-primary/25 shadow-sm ring-1 ring-primary/10">
                <Calendar className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Book Your Demo</h3>
                <p className="text-muted-foreground mb-6">Click the button below to open our booking calendar</p>
                <Button onClick={openCalendlyDirect} size="lg">
                  <ExternalLink className="size-4 mr-2" />
                  Book Your Demo
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-1 pt-4 border-t">
                <p>Or contact us directly:</p>
                <p>📧 echorift.ai@gmail.com</p>
                <p>📞 +91 9622523921</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
