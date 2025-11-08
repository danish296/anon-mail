"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, Mail, Github, MessageSquare, Send } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function ContactPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email for any inquiries",
      value: "danishakhtarx022@gmail.com",
      link: "mailto:danishakhtarx022@gmail.com",
      buttonText: "Send Email"
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Follow our development and report issues",
      value: "@danish296",
      link: "https://github.com/danish296",
      buttonText: "Visit GitHub"
    },
    {
      icon: MessageSquare,
      title: "Feature Requests",
      description: "Have an idea? Open an issue on GitHub",
      value: "github.com/danish296",
      link: "https://github.com/danish296/v0-ai-service-landing-page/issues",
      buttonText: "Submit Request"
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
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>

          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <Send className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you!
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-background to-background/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="inline-flex items-center justify-center rounded-lg bg-primary p-3 shadow-sm ring-1 ring-primary/20">
                      <Icon className="size-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                      <p className="text-sm font-mono text-primary mb-4">{method.value}</p>
                      <a 
                        href={method.link} 
                        target={method.link.startsWith('http') ? '_blank' : undefined}
                        rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          {method.buttonText}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h3 className="font-semibold text-lg mb-2">How do I report a bug?</h3>
                <p className="text-sm text-muted-foreground">
                  Open an issue on our GitHub repository with detailed steps to reproduce the bug, your environment details, and any error messages.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h3 className="font-semibold text-lg mb-2">Can I request new features?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! We welcome feature requests. Open an issue on GitHub with the "feature request" label and describe your idea.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h3 className="font-semibold text-lg mb-2">How quickly will I get a response?</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours on weekdays. For urgent issues, please mention "urgent" in your subject line.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h3 className="font-semibold text-lg mb-2">Is there a community forum?</h3>
                <p className="text-muted-foreground">
                  We're planning to launch a community forum soon. For now, GitHub Discussions is the best place for community interaction.
                </p>
              </div>
            </div>
          </div>

          {/* Business Inquiries */}
          <div className="p-8 rounded-lg border border-primary/30 bg-primary/5 text-center">
            <h2 className="text-2xl font-bold mb-4">Business Inquiries</h2>
            <p className="text-muted-foreground mb-6">
              Interested in enterprise solutions, partnerships, or custom integrations? Let's talk!
            </p>
            <a href="mailto:danishakhtarx022@gmail.com?subject=Business Inquiry - QuickMail">
              <Button size="lg">
                <Mail className="mr-2 size-5" />
                Contact for Business
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
