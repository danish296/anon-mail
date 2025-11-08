"use client"

import { useState } from "react"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CalendlyFallbackProps {
  onClose: () => void
}

export function CalendlyFallback({ onClose }: CalendlyFallbackProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleBookDemo = () => {
    setIsRedirecting(true)
    window.open("https://calendly.com/echorift-ai", "_blank", "noopener,noreferrer")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-primary/15 dark:bg-primary/25 shadow-sm ring-1 ring-primary/10">
          <Calendar className="size-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Let's Schedule Your Demo</h3>
          <p className="text-muted-foreground">
            Book a personalized 30-minute demo with our AI experts to see how EchoRift can transform your business.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="size-6 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-sm">30 Minutes</h4>
            <p className="text-xs text-muted-foreground">Quick demo session</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <User className="size-6 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-sm">AI Expert</h4>
            <p className="text-xs text-muted-foreground">Personalized walkthrough</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="size-6 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-sm">Flexible</h4>
            <p className="text-xs text-muted-foreground">Choose your time</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Button onClick={handleBookDemo} className="w-full" size="lg" disabled={isRedirecting}>
          {isRedirecting ? "Opening Calendar..." : "Book Your Demo"}
          <ArrowRight className="ml-2 size-4" />
        </Button>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Or contact us directly:</p>
          <div className="space-y-1">
            <p>📧 echorift.ai@gmail.com</p>
            <p>📞 +91 9622523921</p>
          </div>
        </div>
      </div>
    </div>
  )
}
