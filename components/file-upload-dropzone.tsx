"use client"

import { useCallback, useState, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { X, File, AlertCircle, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttachmentFile {
  file: File
  id: string
  error?: string
}

interface FileUploadDropzoneProps {
  onFilesChange: (files: File[]) => void
  maxSize?: number // in bytes, default 25MB
  maxFiles?: number
  acceptedFormats?: string[]
  value?: File[] // Add value prop to control the component from parent
}

const ALLOWED_MIME_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  pdf: ["application/pdf"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  text: ["text/plain", "text/csv"],
  archive: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
}

const ALL_ALLOWED_TYPES = Object.values(ALLOWED_MIME_TYPES).flat()

// Helper function to check if file is an image
const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

// Helper function to create image preview URL
const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

export function FileUploadDropzone({
  onFilesChange,
  maxSize = 25 * 1024 * 1024, // 25MB default
  maxFiles = 10,
  acceptedFormats,
  value = [], // Default to empty array
}: FileUploadDropzoneProps) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const onFilesChangeRef = useRef(onFilesChange)

  // Update ref when callback changes
  useEffect(() => {
    onFilesChangeRef.current = onFilesChange
  }, [onFilesChange])

  // Sync internal state with external value prop
  useEffect(() => {
    if (value.length === 0 && attachments.length > 0) {
      // Parent cleared the files, clear internal state
      setAttachments([])
    }
  }, [value.length])

  // Notify parent when attachments change (after render)
  useEffect(() => {
    const validFiles = attachments
      .filter((a) => !a.error)
      .map((a) => a.file)
    onFilesChangeRef.current(validFiles)
  }, [attachments])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setAttachments((prevAttachments) => {
        let newAttachments = [...prevAttachments]

        // Process accepted files
        acceptedFiles.forEach((file) => {
          if (newAttachments.length >= maxFiles) {
            return
          }

          if (file.size > maxSize) {
            newAttachments.push({
              file,
              id: `${file.name}-${Date.now()}`,
              error: `File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`,
            })
            return
          }

          if (!ALL_ALLOWED_TYPES.includes(file.type)) {
            newAttachments.push({
              file,
              id: `${file.name}-${Date.now()}`,
              error: "File type not allowed",
            })
            return
          }

          newAttachments.push({
            file,
            id: `${file.name}-${Date.now()}`,
          })
        })

        // Warn about rejected files
        if (rejectedFiles.length > 0) {
          console.warn(
            "Rejected files:",
            rejectedFiles.map((r) => r.file.name)
          )
        }

        return newAttachments
      })
    },
    [maxFiles, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles,
    noClick: false,
  })

  const removeAttachment = (id: string) => {
    setAttachments((prevAttachments) => {
      const updated = prevAttachments.filter((a) => a.id !== id)
      return updated
    })
  }

  // Image preview component
  const ImagePreview = ({ file, className }: { file: File; className?: string }) => {
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
      if (isImageFile(file)) {
        const url = createImagePreview(file)
        setPreviewUrl(url)
        setIsLoading(false)
        
        // Cleanup URL when component unmounts
        return () => URL.revokeObjectURL(url)
      }
    }, [file])

    if (!isImageFile(file) || hasError) {
      return <ImageIcon className={`size-8 text-muted-foreground ${className}`} />
    }

    if (isLoading) {
      return (
        <div className={`size-8 bg-muted rounded flex items-center justify-center ${className}`}>
          <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      )
    }

    return (
      <img
        src={previewUrl}
        alt={file.name}
        className={`object-cover rounded border ${className}`}
        onError={() => setHasError(true)}
      />
    )
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-sm text-muted-foreground">
          {isDragActive ? (
            <p className="font-medium text-primary">Drop files here...</p>
          ) : (
            <>
              <p className="font-medium">Drag & drop files here</p>
              <p className="text-xs mt-1">
                or click to select (Max {Math.round(maxSize / 1024 / 1024)}MB, up to {maxFiles} files)
              </p>
              <p className="text-xs mt-2 text-muted-foreground/75">
                Images, PDFs, Office docs, text files, and archives supported
              </p>
            </>
          )}
        </div>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className={`flex items-center gap-3 p-2 rounded-md border ${
                attachment.error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-muted bg-muted/30"
              }`}
            >
              {attachment.error ? (
                <AlertCircle className="size-4 text-destructive flex-shrink-0" />
              ) : isImageFile(attachment.file) ? (
                <div className="flex-shrink-0">
                  <ImagePreview file={attachment.file} className="size-12" />
                </div>
              ) : (
                <File className="size-4 text-muted-foreground flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm truncate font-medium">{attachment.file.name}</p>
                {attachment.error ? (
                  <p className="text-xs text-destructive">{attachment.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {(attachment.file.size / 1024).toFixed(1)} KB
                    {isImageFile(attachment.file) && " • Image"}
                  </p>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeAttachment(attachment.id)}
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {attachments.length >= maxFiles && (
        <p className="text-xs text-amber-600 dark:text-amber-500">
          Maximum number of files reached ({maxFiles})
        </p>
      )}
    </div>
  )
}
