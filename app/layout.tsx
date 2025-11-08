import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { SuppressHydrationWarnings } from "@/components/suppress-hydration-warnings"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuickMail - Send Emails Fast with AI",
  description:
    "QuickMail helps you send emails quickly with AI-powered body generation. Real-time validation, instant feedback, and seamless email composition.",
  generator: 'danishakhtar.tech',
  icons: {
    icon: [
      { url: 'public/logo.png', sizes: 'any' },
      { url: 'public/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <SuppressHydrationWarnings />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
