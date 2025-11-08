"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, Clock, Github, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function PricingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 shadow-sm border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" href="/" />

          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>

          {/* Coming Soon Card */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <Clock className="size-20 text-primary animate-pulse" />
                <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Pricing Coming Soon
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're working on flexible pricing plans that work for everyone - from individual users to enterprises.
              Currently, QuickMail is available for free while we finalize our pricing structure.
            </p>

            {/* Current Status */}
            <div className="mb-12 p-6 rounded-lg border border-primary/30 bg-primary/5 max-w-md mx-auto">
              <h3 className="font-semibold text-xl mb-2">Current Status: Free Access</h3>
              <p className="text-sm text-muted-foreground">
                Enjoy unlimited access to all features while we're in beta. No credit card required.
              </p>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Interested in enterprise plans or have questions about pricing?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://github.com/danish296" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Github className="mr-2 size-5" />
                    Contact on GitHub
                  </Button>
                </a>

                <a 
                  href="mailto:danishakhtarx022@gmail.com" 
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    <Mail className="mr-2 size-5" />
                    Email Us
                  </Button>
                </a>
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                danishakhtarx022@gmail.com
              </p>
            </div>

            {/* What to Expect */}
            <div className="mt-16 text-left max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">What to Expect</h2>
              <div className="grid gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <h3 className="font-semibold mb-2">🎯 Free Tier</h3>
                  <p className="text-sm text-muted-foreground">
                    Perfect for individual users and small projects with generous monthly limits.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <h3 className="font-semibold mb-2">💼 Professional Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    For businesses needing higher volumes and priority support.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                  <h3 className="font-semibold mb-2">🏢 Enterprise Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom solutions with dedicated support and SLA guarantees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
