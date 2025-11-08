"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Undo2,
  Redo2,
  Image as ImageIcon,
  X,
} from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"

interface RichEmailEditorContentProps {
  value: string
  onChange: (html: string, text: string) => void
}

export function RichEmailEditorContent({ value, onChange }: RichEmailEditorContentProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your email...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[250px]',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      onChange(html, text)
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update editor content when value prop changes (e.g., from AI generation)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const { from, to } = editor.state.selection
      editor.commands.setContent(value || "", { emitUpdate: false })
      // Restore cursor position if editor was focused
      if (editor.isFocused && from !== null && to !== null) {
        const maxPos = editor.state.doc.content.size
        editor.commands.setTextSelection({ 
          from: Math.min(from, maxPos), 
          to: Math.min(to, maxPos) 
        })
      }
    }
  }, [value, editor])

  const handleImageButtonClick = useCallback(() => {
    setShowImageUpload(true)
    setImageUrl("")
    setImageFile(null)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleImageUpload = useCallback(() => {
    if (!editor) {
      console.log("Editor not available")
      return
    }
    
    console.log("Uploading image:", { imageFile, imageUrl })
    
    if (imageFile) {
      console.log("Processing file:", imageFile.name, imageFile.type, imageFile.size)
      // Convert file to base64 data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        console.log("Data URL created, length:", dataUrl?.length)
        if (dataUrl) {
          try {
            editor.chain().focus().setImage({ src: dataUrl }).run()
            console.log("Image inserted into editor")
          } catch (error) {
            console.error("Error inserting image:", error)
            // Fallback: insert as HTML
            editor.chain().focus().insertContent(`<img src="${dataUrl}" alt="Uploaded image" class="max-w-full h-auto rounded-lg" />`).run()
            console.log("Image inserted as HTML fallback")
          }
        }
      }
      reader.onerror = (e) => {
        console.error("FileReader error:", e)
      }
      reader.readAsDataURL(imageFile)
    } else if (imageUrl.trim()) {
      console.log("Using URL:", imageUrl.trim())
      try {
        editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
        console.log("Image inserted from URL")
      } catch (error) {
        console.error("Error inserting image from URL:", error)
        // Fallback: insert as HTML
        editor.chain().focus().insertContent(`<img src="${imageUrl.trim()}" alt="Image from URL" class="max-w-full h-auto rounded-lg" />`).run()
        console.log("Image inserted as HTML fallback")
      }
    } else {
      console.log("No file or URL provided")
    }
    
    setShowImageUpload(false)
    setImageUrl("")
    setImageFile(null)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [editor, imageFile, imageUrl])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("File selected:", file)
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      setImageUrl("") // Clear URL when file is selected
      console.log("Image file set:", file.name, file.type, file.size)
    } else if (file) {
      console.log("Invalid file type:", file.type)
    }
  }, [])

  const handleUrlInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value)
    setImageFile(null) // Clear file when URL is entered
  }, [])

  if (!isMounted || !editor) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-background p-4 min-h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  const toolbarButton = (
    onClick: () => void,
    isActive?: boolean,
    icon: React.ReactNode = null,
    label: string = ""
  ) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault() // Prevent focus loss
        onClick()
      }}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80 text-foreground"
      }`}
      title={label}
    >
      {icon}
    </button>
  )

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
        {toolbarButton(
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
          <Bold className="size-4" />,
          "Bold (Ctrl+B)"
        )}

        {toolbarButton(
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
          <Italic className="size-4" />,
          "Italic (Ctrl+I)"
        )}

        <div className="w-px bg-border" />

        {toolbarButton(
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
          <Heading2 className="size-4" />,
          "Heading 2"
        )}

        {toolbarButton(
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
          <List className="size-4" />,
          "Bullet List"
        )}

        {toolbarButton(
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
          <ListOrdered className="size-4" />,
          "Ordered List"
        )}

        <div className="w-px bg-border" />

        {toolbarButton(handleImageButtonClick, showImageUpload, <ImageIcon className="size-4" />, "Insert Image")}

        <div className="w-px bg-border" />

        {toolbarButton(
          () => editor.chain().focus().undo().run(),
          false,
          <Undo2 className="size-4" />,
          "Undo"
        )}

        {toolbarButton(
          () => editor.chain().focus().redo().run(),
          false,
          <Redo2 className="size-4" />,
          "Redo"
        )}
      </div>

      {/* Custom Image Upload UI */}
      {showImageUpload && (
        <div className="border-b border-border bg-muted/20 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Insert Image</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageUpload(false)}
                className="h-6 w-6 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* File Upload Option */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Upload Image</label>
                <div className="mt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="size-4 mr-2" />
                    Choose File
                  </Button>
                  {imageFile && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                      </p>
                      <div className="w-20 h-20 border border-border rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* URL Option */}
              <div>
                <label className="text-xs font-medium text-muted-foreground">Or enter image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlInput}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleImageUpload}
                  size="sm"
                  disabled={!imageFile && !imageUrl.trim()}
                  className="flex-1"
                >
                  Insert Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImageUpload(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="px-4 py-3 min-h-[300px] cursor-text" onClick={() => editor?.chain().focus().run()}>
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none focus:outline-none [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:outline-none"
        />
      </div>
    </div>
  )
}
