"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Zap, Shield, Sparkles, Bell, ArrowLeft, Mail, Lock, Gauge, Globe } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function FeaturesPage() {
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
      icon: Sparkles,
      title: "AI-Powered Content Generation",
      description: "Leverage advanced AI (Gemini 2.5 Flash) to generate professional, contextually relevant email content based on your subject line. Save time and ensure quality communication every time.",
      benefits: ["Context-aware generation", "Professional tone", "Instant results", "Multiple iterations"]
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Send emails instantly through our optimized delivery system powered by Brevo. Experience sub-second delivery times with enterprise-grade reliability.",
      benefits: ["Instant delivery", "99.9% uptime", "Real-time status", "Automatic retries"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your data is protected with industry-standard encryption and security protocols. We never store your email content and use secure API connections for all communications.",
      benefits: ["End-to-end encryption", "No data retention", "GDPR compliant", "Secure API keys"]
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Get instant feedback on your email delivery status with our notification system. Know immediately if there are any issues or when your email is successfully delivered.",
      benefits: ["Success alerts", "Error handling", "Delivery tracking", "Status updates"]
    },
    {
      icon: Mail,
      title: "Simple Email Interface",
      description: "Clean, intuitive interface designed for efficiency. No complicated settings or configurations - just enter your recipient, subject, and you're ready to send.",
      benefits: ["User-friendly design", "Minimal learning curve", "Mobile responsive", "Dark mode support"]
    },
    {
      icon: Lock,
      title: "API Rate Limiting",
      description: "Built-in rate limiting protects your API keys and ensures fair usage. Prevents abuse while maintaining optimal performance for legitimate use.",
      benefits: ["Smart throttling", "Fair usage policy", "API protection", "Cost optimization"]
    },
    {
      icon: Gauge,
      title: "Performance Optimized",
      description: "Built with modern technologies like Next.js 14, React, and FastAPI for blazing-fast performance. Optimized for both desktop and mobile devices.",
      benefits: ["Fast page loads", "Smooth animations", "Responsive design", "PWA ready"]
    },
    {
      icon: Globe,
      title: "Cross-Platform Support",
  description: "Access QuickMail from any device - desktop, tablet, or mobile. Our responsive design ensures a consistent experience across all platforms.",
      benefits: ["Works everywhere", "Progressive web app", "Offline support", "Multi-device sync"]
    }
  ]

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
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-6xl">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>

          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Powerful Features
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to send professional emails quickly and efficiently, powered by cutting-edge AI technology.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background to-background/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  <div className="flex flex-col gap-4">
                    <div className="inline-flex w-fit items-center justify-center rounded-lg bg-primary p-3 shadow-sm ring-1 ring-primary/20">
                      <Icon className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <div className="size-1.5 rounded-full bg-primary mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Start sending professional emails with AI assistance today.
            </p>
            <Link href="/">
              <Button size="lg" className="font-semibold">
                Try QuickMail Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
