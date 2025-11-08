"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, Book, Code, Zap, Settings, Shield, Terminal } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function DocumentationPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const docs = [
    {
      icon: Zap,
      title: "Quick Start",
  description: "Get started with QuickMail in minutes",
      content: [
        "1. Enter the recipient's email address",
        "2. Add a subject line for your email",
        "3. Click 'Generate with AI' to create content or write your own",
        "4. Review and edit the generated content",
        "5. Click 'Send Email' to deliver your message"
      ]
    },
    {
      icon: Code,
      title: "API Integration",
  description: "Integrate QuickMail into your applications",
      content: [
        "Base URL: http://127.0.0.1:8000",
        "POST /send-email - Send an email",
        "POST /generate-body - Generate AI content",
        "GET / - Health check endpoint",
        "All endpoints accept JSON and return JSON responses"
      ]
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Set up your environment variables",
      content: [
        "BREVO_API_KEY - Your Brevo API key for sending emails",
        "BREVO_FROM_EMAIL - The sender email address",
        "GEMINI_API_KEY - Google Gemini API key for AI features",
        "Copy env.example to .env and fill in your credentials"
      ]
    },
    {
      icon: Shield,
      title: "Security",
      description: "Best practices for secure usage",
      content: [
        "Never commit your .env file to version control",
        "Store API keys securely using environment variables",
        "Use rate limiting to prevent API abuse",
        "Validate all user inputs before processing",
        "Keep your dependencies up to date"
      ]
    },
    {
      icon: Terminal,
      title: "Backend Setup",
      description: "Running the Python FastAPI backend",
      content: [
        "Install Python 3.9+ on your system",
        "Install dependencies: pip install -r requirements.txt",
        "Configure .env file with your API keys",
        "Run server: python run_server.py",
        "Server runs on http://127.0.0.1:8000"
      ]
    },
    {
      icon: Book,
      title: "Frontend Setup",
      description: "Running the Next.js frontend",
      content: [
        "Install Node.js 18+ and pnpm",
        "Install dependencies: pnpm install",
        "Run development server: pnpm dev",
        "Build for production: pnpm build",
        "Frontend runs on http://localhost:3000"
      ]
    }
  ]

  const apiExamples = {
    sendEmail: `// Send Email Example
fetch('http://127.0.0.1:8000/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from QuickMail',
    body: 'This is a test email.'
  })
})`,
    generateBody: `// Generate AI Content Example
fetch('http://127.0.0.1:8000/generate-body', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Meeting Tomorrow'
  })
})`
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
              Documentation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about using and integrating QuickMail
            </p>
          </div>

          {/* Documentation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {docs.map((doc, index) => {
              const Icon = doc.icon
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-gradient-to-br from-background to-background/50 p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex w-fit items-center justify-center rounded-lg bg-primary p-3 shadow-sm ring-1 ring-primary/20">
                      <Icon className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-foreground mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                      <ul className="space-y-2">
                        {doc.content.map((item, i) => (
                          <li key={i} className="flex items-start text-sm text-muted-foreground">
                            <div className="size-1.5 rounded-full bg-primary mr-2 mt-1.5 flex-shrink-0"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* API Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">API Examples</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-background/50 p-6">
                <h3 className="font-semibold text-lg mb-3">Send Email</h3>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-xs md:text-sm">
                  <code>{apiExamples.sendEmail}</code>
                </pre>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/50 p-6">
                <h3 className="font-semibold text-lg mb-3">Generate AI Content</h3>
                <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-xs md:text-sm">
                  <code>{apiExamples.generateBody}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-semibold">Frontend</p>
                <p className="text-sm text-muted-foreground">Next.js 14</p>
              </div>
              <div>
                <p className="font-semibold">Backend</p>
                <p className="text-sm text-muted-foreground">FastAPI</p>
              </div>
              <div>
                <p className="font-semibold">AI Model</p>
                <p className="text-sm text-muted-foreground">Gemini 2.5 Flash</p>
              </div>
              <div>
                <p className="font-semibold">Email Service</p>
                <p className="text-sm text-muted-foreground">Brevo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
