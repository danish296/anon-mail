"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, Shield, Lock, Eye, Database, FileText, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function PrivacyPolicyPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const lastUpdated = "October 18, 2025"

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
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <Shield className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="mb-8 p-6 rounded-lg border border-primary/30 bg-primary/5">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="size-6" />
                Your Privacy Matters
              </h2>
              <p className="text-muted-foreground">
                At QuickMail, we take your privacy seriously. This policy outlines how we handle your data when you use our email service.
              </p>
            </div>

            <div className="space-y-8">
              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Database className="size-6 text-primary" />
                  Data Collection
                </h2>
                <h3 className="text-xl font-semibold mb-2">What We Collect:</h3>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Email addresses (sender and recipient) for delivery purposes only</li>
                  <li>Email subject lines and body content (temporarily, for sending)</li>
                  <li>Usage statistics and error logs for service improvement</li>
                  <li>Your theme preference (stored locally in your browser)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">What We DON'T Collect:</h3>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Personal identification information</li>
                  <li>Payment information (service is currently free)</li>
                  <li>Browsing history or tracking cookies</li>
                  <li>Email content after successful delivery</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="size-6 text-primary" />
                  How We Use Your Data
                </h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>Email Delivery:</strong> We use your email data solely to send emails through our service provider (Brevo).
                  </li>
                  <li>
                    <strong>AI Generation:</strong> Subject lines are sent to Google Gemini API to generate email content. No personal data is included.
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> Anonymous usage statistics help us improve the service.
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Error logs help us diagnose and fix issues quickly.
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="size-6 text-primary" />
                  Data Retention
                </h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>Email Content:</strong> Deleted immediately after successful delivery or error
                  </li>
                  <li>
                    <strong>Error Logs:</strong> Kept for 30 days for debugging purposes
                  </li>
                  <li>
                    <strong>Usage Statistics:</strong> Anonymous metrics kept for 90 days
                  </li>
                  <li>
                    <strong>API Keys:</strong> Your API keys are never stored; they're used only in transit
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="size-6 text-primary" />
                  Security Measures
                </h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>All data transmission is encrypted using HTTPS/TLS</li>
                  <li>API keys are stored securely using environment variables</li>
                  <li>Rate limiting prevents abuse and unauthorized access</li>
                  <li>No email content is logged or stored permanently</li>
                  <li>Regular security audits and dependency updates</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
                <p className="text-muted-foreground mb-3">
                  We use the following third-party services to provide QuickMail:
                </p>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>Brevo:</strong> Email delivery service (subject to Brevo's privacy policy)
                  </li>
                  <li>
                    <strong>Google Gemini:</strong> AI content generation (subject to Google's privacy policy)
                  </li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  We recommend reviewing these services' privacy policies for complete transparency.
                </p>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>Request deletion of any data we may have</li>
                  <li>Access any personal information we store</li>
                  <li>Opt-out of any data collection (though this may limit functionality)</li>
                  <li>Request clarification on our data practices</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-primary/30 bg-primary/5">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="size-6 text-primary" />
                  Contact Us
                </h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions or concerns about our privacy practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    <strong>Email:</strong> <a href="mailto:danishakhtarx022@gmail.com" className="text-primary hover:underline">danishakhtarx022@gmail.com</a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>GitHub:</strong> <a href="https://github.com/danish296" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@danish296</a>
                  </p>
                </div>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this privacy policy from time to time. We will notify users of any material changes by updating the "Last Updated" date at the top of this policy. Continued use of QuickMail after changes constitutes acceptance of the updated policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
