"use client"

import type React from "react"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyButtonProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function CalendlyButton({ children, className, size = "default", variant = "default" }: CalendlyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)

    // Try to open Calendly directly
    try {
      window.open("https://calendly.com/echorift-ai", "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Failed to open Calendly:", error)
      // Fallback to mailto
      window.location.href =
        "mailto:echorift.ai@gmail.com?subject=Demo Request&body=Hi, I would like to schedule a demo of EchoRift AI."
    }

    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <Button onClick={handleClick} className={className} size={size} variant={variant} disabled={isLoading}>
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Opening...
        </>
      ) : (
        <>
          {children}
          <ExternalLink className="ml-2 size-4" />
        </>
      )}
    </Button>
  )
}
