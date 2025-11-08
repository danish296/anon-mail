"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Logo } from "@/components/logo"

export default function TermsPage() {
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
              <FileText className="size-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last Updated: {lastUpdated}</p>
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="mb-8 p-6 rounded-lg border border-primary/30 bg-primary/5">
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using QuickMail, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our service.
              </p>
            </div>

            <div className="space-y-8">
              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="size-6 text-green-500" />
                  Acceptable Use
                </h2>
                <p className="text-muted-foreground mb-4">You agree to use QuickMail only for lawful purposes. You may:</p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Send legitimate business or personal emails</li>
                  <li>Use AI features to generate professional content</li>
                  <li>Integrate QuickMail into your applications via our API</li>
                  <li>Use the service for commercial purposes</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <XCircle className="size-6 text-red-500" />
                  Prohibited Activities
                </h2>
                <p className="text-muted-foreground mb-4">You agree NOT to:</p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Send spam, unsolicited emails, or mass marketing without consent</li>
                  <li>Use the service for phishing, fraud, or deceptive practices</li>
                  <li>Transmit malicious code, viruses, or harmful content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Abuse the API or attempt to bypass rate limits</li>
                  <li>Send content that is illegal, harmful, or violates others' rights</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Service Availability</h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>Beta Status:</strong> QuickMail is currently in beta. Features may change without notice.
                  </li>
                  <li>
                    <strong>Uptime:</strong> While we strive for high availability, we do not guarantee 100% uptime.
                  </li>
                  <li>
                    <strong>Maintenance:</strong> We may perform scheduled or emergency maintenance that temporarily interrupts service.
                  </li>
                  <li>
                    <strong>Changes:</strong> We reserve the right to modify or discontinue features at any time.
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Rate Limits & Quotas</h2>
                <p className="text-muted-foreground mb-4">To ensure fair usage and service quality:</p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Email sending: 15 requests per minute</li>
                  <li>AI generation: 10 requests per minute</li>
                  <li>Additional quotas may apply based on your plan (when pricing is introduced)</li>
                  <li>Excessive use may result in temporary or permanent suspension</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">API Keys & Security</h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>Your Responsibility:</strong> You are responsible for keeping your API keys secure.
                  </li>
                  <li>
                    <strong>Unauthorized Access:</strong> Immediately notify us if you suspect unauthorized use of your keys.
                  </li>
                  <li>
                    <strong>Liability:</strong> You are responsible for all activity that occurs using your API keys.
                  </li>
                  <li>
                    <strong>Rotation:</strong> We recommend regularly rotating your API keys for security.
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
                  <li>
                    <strong>QuickMail IP:</strong> All QuickMail code, design, and branding are owned by us.
                  </li>
                  <li>
                    <strong>Your Content:</strong> You retain all rights to the content you send through QuickMail.
                  </li>
                  <li>
                    <strong>AI-Generated Content:</strong> AI-generated content is provided as-is. You're responsible for reviewing and editing it.
                  </li>
                  <li>
                    <strong>License:</strong> We grant you a limited, non-exclusive license to use QuickMail.
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="size-6 text-amber-500" />
                  Disclaimer of Warranties
                </h2>
                <p className="text-muted-foreground mb-4">
                  QuickMail is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
                </p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>No guarantee of uninterrupted or error-free service</li>
                  <li>No guarantee of email delivery (dependent on third-party services)</li>
                  <li>No guarantee of AI-generated content accuracy or quality</li>
                  <li>No guarantee of data security (though we implement best practices)</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, QuickMail and its developers shall not be liable for:
                </p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Any indirect, incidental, special, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Damages resulting from unauthorized access or data breaches</li>
                  <li>Issues arising from third-party services (Brevo, Google Gemini)</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Termination</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to:
                </p>
                <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
                  <li>Suspend or terminate your access for violations of these terms</li>
                  <li>Refuse service to anyone for any reason</li>
                  <li>Modify or discontinue the service with or without notice</li>
                  <li>Remove content that violates our policies</li>
                </ul>
              </section>

              <section className="p-6 rounded-lg border border-border/50 bg-background/50">
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration or in the courts of appropriate jurisdiction.
                </p>
              </section>

              <section className="p-6 rounded-lg border border-primary/30 bg-primary/5">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions about these Terms of Service, please contact us:
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
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We may update these Terms of Service from time to time. Material changes will be communicated by updating the "Last Updated" date. Your continued use of QuickMail after changes constitutes acceptance of the updated terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
