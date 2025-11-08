"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Loader2, Copy, Zap, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RichEmailEditor } from "@/components/rich-email-editor"
import { FileUploadDropzone } from "@/components/file-upload-dropzone"

// API URL from environment variable or default to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface Notification {
  id: string
  type: "success" | "error" | "info"
  message: string
}

interface FormDataState {
  to: string
  subject: string
  bodyHtml: string
  bodyText: string
  cc: string
  bcc: string
  attachments: File[]
}

export function EmailForm() {
  const [formData, setFormData] = useState<FormDataState>({
    to: "",
    subject: "",
    bodyHtml: "",
    bodyText: "",
    cc: "",
    bcc: "",
    attachments: [],
  })

  const [emailError, setEmailError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [bodyCopied, setBodyCopied] = useState(false)
  const [hasAcceptedTos, setHasAcceptedTos] = useState(false)
  const [tosTouched, setTosTouched] = useState(false)

  // Email validation regex
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setFormData({ ...formData, to: email })

    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  // Add notification
  const addNotification = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  // Generate email body with AI
  const handleGenerateBody = async () => {
    if (!formData.subject.trim()) {
      addNotification("error", "Please enter a subject line first")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch(`${API_URL}/generate-body`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: formData.subject }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to generate body")
      }

      const data = await response.json()
      // Convert plain text to HTML paragraphs for rich editor
      const textBody = data.body
      const htmlBody = textBody
        .split('\n\n')
        .filter((para: string) => para.trim())
        .map((para: string) => `<p>${para.trim()}</p>`)
        .join('')
      
      setFormData({ ...formData, bodyText: textBody, bodyHtml: htmlBody })
      addNotification("success", "Email body generated successfully!")
    } catch (error) {
      addNotification("error", error instanceof Error ? error.message : "Failed to generate body")
    } finally {
      setIsGenerating(false)
    }
  }

  // Send email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasAcceptedTos) {
      setTosTouched(true)
      addNotification("error", "Please agree to the Terms of Service before sending.")
      return
    }

    // Validation
    if (!formData.to || emailError) {
      addNotification("error", "Please enter a valid email address")
      return
    }

    if (!formData.subject.trim()) {
      addNotification("error", "Please enter a subject")
      return
    }

    if (!formData.bodyText.trim() && !formData.bodyHtml.trim()) {
      addNotification("error", "Please enter an email body")
      return
    }

    setIsLoading(true)
    try {
      // Build FormData for multipart submission
      const submitData = new FormData()
      submitData.append("to", formData.to)
      submitData.append("subject", formData.subject)
      
      // Extract images from HTML content and convert to attachments
      const extractedImages: File[] = []
      if (formData.bodyHtml) {
        const htmlContent = formData.bodyHtml
        const base64ImageRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"/g
        let match
        let imageIndex = 0
        
        while ((match = base64ImageRegex.exec(htmlContent)) !== null) {
          const mimeType = match[1]
          const base64Data = match[2]
          
          try {
            // Convert base64 to blob
            const byteCharacters = atob(base64Data)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: `image/${mimeType}` })
            
            // Create file from blob
            const fileName = `image_${imageIndex + 1}.${mimeType}`
            const file = new File([blob], fileName, { type: `image/${mimeType}` })
            extractedImages.push(file)
            
            console.log(`Extracted image ${imageIndex + 1}:`, fileName, file.size, file.type)
            imageIndex++
          } catch (error) {
            console.error("Error extracting image:", error)
          }
        }
      }

      // Ensure body_text is not empty (use bodyText or extract from bodyHtml)
      const bodyTextToSend = formData.bodyText.trim() || formData.bodyHtml.replace(/<[^>]*>/g, '').trim() || "Email body"
      submitData.append("body_text", bodyTextToSend)
      
      if (formData.bodyHtml && formData.bodyHtml.trim()) {
        // Clean HTML content by removing base64 images (they'll be sent as attachments)
        let cleanedHtml = formData.bodyHtml
        if (extractedImages.length > 0) {
          // Remove base64 images from HTML content
          cleanedHtml = cleanedHtml.replace(
            /<img[^>]+src="data:image\/[^;]+;base64,[^"]+".*?\/>/g,
            (match) => {
              const altMatch = match.match(/alt="([^"]*)"/)
              const altText = altMatch ? altMatch[1] : "Image"
              return `<p><strong>[Image: ${altText}]</strong></p>`
            }
          )
          console.log("Cleaned HTML content, removed base64 images")
          addNotification("info", `${extractedImages.length} image(s) will be sent as attachments`)
        }
        submitData.append("body_html", cleanedHtml)
      }
      
      if (formData.cc && formData.cc.trim()) submitData.append("cc", formData.cc)
      if (formData.bcc && formData.bcc.trim()) submitData.append("bcc", formData.bcc)

      // Add all files (including extracted images and regular attachments)
      const allFiles = [...(formData.attachments || []), ...extractedImages]
      if (allFiles.length > 0) {
        console.log("Processing attachments:", allFiles)
        allFiles.forEach((file, index) => {
          console.log(`Attachment ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type
          })
          if (file && file.size > 0) {
            submitData.append("files", file)
            console.log(`Added file ${index} to FormData:`, file.name)
          }
        })
      }

      // Log FormData entries
      console.log("FormData entries:")
      for (let pair of submitData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], ':', { name: pair[1].name, size: pair[1].size, type: pair[1].type })
        } else {
          console.log(pair[0], ':', pair[1])
        }
      }

      console.log("Sending email with data:", {
        to: formData.to,
        subject: formData.subject,
        bodyTextLength: bodyTextToSend.length,
        bodyHtmlLength: formData.bodyHtml.length,
        filesCount: formData.attachments.length
      })

      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        let errorDetail = "Failed to send email"
        try {
          const error = await response.json()
          errorDetail = error.detail || errorDetail
        } catch {
          errorDetail = `Server error: ${response.status} ${response.statusText}`
        }
        console.error("Send email error:", errorDetail)
        throw new Error(errorDetail)
      }

      addNotification("success", "Email sent successfully!")
      setFormData({
        to: "",
        subject: "",
        bodyHtml: "",
        bodyText: "",
        cc: "",
        bcc: "",
        attachments: [],
      })
      setHasAcceptedTos(false)
      setTosTouched(false)
    } catch (error) {
      addNotification("error", error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsLoading(false)
    }
  }

  // Copy body to clipboard
  const handleCopyBody = () => {
    navigator.clipboard.writeText(formData.bodyText)
    setBodyCopied(true)
    setTimeout(() => setBodyCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm ${
              notification.type === "success"
                ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : notification.type === "error"
                  ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
            }`}
          >
            {notification.type === "success" && <CheckCircle className="size-5 flex-shrink-0" />}
            {notification.type === "error" && <AlertCircle className="size-5 flex-shrink-0" />}
            {notification.type === "info" && <AlertCircle className="size-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        ))}
      </div>

      {/* Email Form Card */}
      <Card className="border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl">Send Email</CardTitle>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/50">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">BETA</span>
            </div>
          </div>
          <CardDescription>Compose and send emails quickly with AI assistance</CardDescription>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                  <span className="text-xs font-bold">β</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Free Beta Access
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                  You're currently using our <strong>free beta version</strong> with access to all premium features! 
                  Enjoy unlimited emails, AI assistance, and file attachments at no cost.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
                  <span className="font-medium">Coming Soon:</span>
                  <span>Pricing plans will be introduced in the coming months</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSendEmail} className="space-y-6">
            {/* Recipient Field */}
            <div className="space-y-2">
              <label htmlFor="to" className="text-sm font-medium">
                Recipient Email
              </label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={handleEmailChange}
                className={`${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {emailError && <p className="text-sm text-red-500 flex items-center gap-1">{emailError}</p>}
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                placeholder="Email subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            {/* CC and BCC Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="cc" className="text-sm font-medium">
                  CC (optional)
                </label>
                <Input
                  id="cc"
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Comma-separated email addresses</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="bcc" className="text-sm font-medium">
                  BCC (optional)
                </label>
                <Input
                  id="bcc"
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  value={formData.bcc}
                  onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Comma-separated email addresses</p>
              </div>
            </div>

            {/* Rich Email Body Editor */}
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Email Body
              </label>
              <RichEmailEditor
                value={formData.bodyHtml}
                onChange={(html, text) => setFormData({ ...formData, bodyHtml: html, bodyText: text })}
              />
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments (optional)</label>
              <FileUploadDropzone
                value={formData.attachments}
                onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
              />
            </div>

            {/* Terms of Service Agreement */}
            <div className="space-y-2">
              <label htmlFor="tos" className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  id="tos"
                  type="checkbox"
                  checked={hasAcceptedTos}
                  onChange={(event) => {
                    setHasAcceptedTos(event.target.checked)
                    if (event.target.checked) {
                      setTosTouched(false)
                    }
                  }}
                  className="mt-0.5 size-4 rounded border border-border accent-primary"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
                  >
                    Terms of Service
                  </Link>
                  .
                </span>
              </label>
              {!hasAcceptedTos && tosTouched && (
                <p className="text-sm text-red-500">You must agree to the Terms of Service before sending.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateBody}
                disabled={!formData.subject.trim() || isGenerating}
                className="flex-1 bg-transparent"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 size-4" />
                    Generate with AI
                  </>
                )}
              </Button>

              {formData.bodyText && (
                <Button type="button" variant="outline" onClick={handleCopyBody} className="flex-1 bg-transparent">
                  <Copy className="mr-2 size-4" />
                  {bodyCopied ? "Copied!" : "Copy Body"}
                </Button>
              )}

              <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none sm:min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Email"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
