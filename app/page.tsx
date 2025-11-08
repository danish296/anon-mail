"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Zap, Shield, Sparkles, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { EmailForm } from "@/components/email-form"
import AnimatedBackground from "@/components/animated-background"
import { Logo } from "@/components/logo"

export default function EmailSenderPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Send emails instantly with our optimized delivery system",
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Generate compelling email content with AI assistance",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your email communications",
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Get instant feedback on delivery status and errors",
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 shadow-sm border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />

          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Animated Background */}
          <AnimatedBackground />

          <EmailForm />

          <div className="mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background to-background/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                    <div className="flex flex-col gap-3">
                      <div className="inline-flex w-fit items-center justify-center rounded-lg bg-primary p-2 shadow-sm ring-1 ring-primary/20">
                        <Icon className="size-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-gradient-to-b from-background to-background/50 backdrop-blur-sm">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col gap-3">
              <Logo size="sm" />
              <p className="text-sm text-muted-foreground">Send emails faster with AI-powered assistance</p>
            </div>

            {/* Links Section */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground text-sm">Product</h4>
              <div className="flex flex-col gap-2">
                <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/documentation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </div>
            </div>

            {/* Legal Section */}
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-foreground text-sm">Legal</h4>
              <div className="flex flex-col gap-2">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40 pt-6">
            <p className="text-xs text-muted-foreground text-center">
              &copy; {new Date().getFullYear()} QuickMail. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
