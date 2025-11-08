"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

interface RichEmailEditorProps {
  value: string
  onChange: (html: string, text: string) => void
}

// Dynamic import to handle SSR issues
const RichEmailEditorContent = dynamic(
  () => import("./rich-email-editor-content").then((mod) => mod.RichEmailEditorContent),
  {
    loading: () => (
      <div className="border border-border rounded-lg overflow-hidden bg-background p-4 min-h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    ),
    ssr: false,
  }
)

export function RichEmailEditor({ value, onChange }: RichEmailEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="border border-border rounded-lg overflow-hidden bg-background p-4 min-h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      }
    >
      <RichEmailEditorContent value={value} onChange={onChange} />
    </Suspense>
  )
}
