# Code Architecture Reference

## Component Tree

```
EmailForm (email-form.tsx)
├── State Management
│   ├── formData: {to, subject, bodyHtml, bodyText, cc, bcc, attachments}
│   ├── emailError
│   ├── isLoading
│   ├── isGenerating
│   ├── notifications[]
│   ├── bodyCopied
│   ├── hasAcceptedTos
│   └── tosTouched
│
├── RichEmailEditor (rich-email-editor.tsx)
│   └── RichEmailEditorContent (rich-email-editor-content.tsx)
│       ├── useEditor (TipTap hook)
│       ├── Toolbar
│       │   ├── Bold button
│       │   ├── Italic button
│       │   ├── Heading button
│       │   ├── Bullet list button
│       │   ├── Ordered list button
│       │   ├── Image button
│       │   ├── Undo button
│       │   └── Redo button
│       └── EditorContent (TipTap render)
│
├── FileUploadDropzone (file-upload-dropzone.tsx)
│   ├── useDropzone (react-dropzone hook)
│   ├── Drag & drop zone
│   ├── File input
│   ├── File list
│   │   ├── File name
│   │   ├── File size
│   │   ├── Error display (if any)
│   │   └── Remove button
│   └── Max files warning
│
└── UI Elements
    ├── Input fields (to, subject, cc, bcc)
    ├── Buttons (Generate AI, Copy Body, Send Email)
    ├── Checkbox (Terms of Service)
    ├── Notifications (toast messages)
    └── Form validation feedback
```

## Data Flow Diagram

```
User Input
    ↓
EmailForm State Update
    ↓
┌─────────────────────────────────────────┐
│ Rich Text Editor                        │
│ ├─ onChange → (html, text) → state      │
│ ├─ bodyHtml state                       │
│ └─ bodyText state                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ File Upload Dropzone                    │
│ ├─ onFilesChange → files → state        │
│ ├─ attachments[] state                  │
│ └─ validation per file                  │
└─────────────────────────────────────────┘
    ↓
User clicks "Send Email"
    ↓
┌─────────────────────────────────────────┐
│ Form Validation                         │
│ ├─ Email format                         │
│ ├─ Subject required                     │
│ ├─ Body not empty                       │
│ ├─ ToS checkbox                         │
│ └─ At least bodyText or bodyHtml        │
└─────────────────────────────────────────┘
    ↓
Build FormData
    ├─ Form fields (to, subject, cc, bcc, body_text, body_html)
    └─ Append files[] to "files" field
    ↓
POST /send-email (multipart/form-data)
    ↓
┌─────────────────────────────────────────┐
│ Backend Processing (email.py endpoint)  │
│ ├─ Parse form fields                    │
│ ├─ Validate files                       │
│ ├─ Base64 encode file contents          │
│ ├─ Create attachment objects            │
│ └─ Call email_service.send_email()      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Email Service (email_service.py)        │
│ ├─ Parse CC list                        │
│ ├─ Parse BCC list                       │
│ ├─ Validate recipients                  │
│ ├─ Create SendSmtpEmail                 │
│ ├─ Add CC/BCC/Attachments               │
│ ├─ Choose HTML or plain text            │
│ └─ Send via Brevo SDK                   │
└─────────────────────────────────────────┘
    ↓
Brevo SMTP Gateway
    ↓
Email delivered to recipient
    ↓
Success notification to user
```

## API Endpoint Schema

### Request
```
POST /send-email
Content-Type: multipart/form-data

Headers:
  Content-Type: multipart/form-data; boundary=...

Body:
--boundary
Content-Disposition: form-data; name="to"

user@example.com
--boundary
Content-Disposition: form-data; name="subject"

Hello World
--boundary
Content-Disposition: form-data; name="body_text"

This is plain text
--boundary
Content-Disposition: form-data; name="body_html"

<p>This is <b>HTML</b></p>
--boundary
Content-Disposition: form-data; name="cc"

cc1@example.com, cc2@example.com
--boundary
Content-Disposition: form-data; name="bcc"

bcc@example.com
--boundary
Content-Disposition: form-data; name="files"; filename="document.pdf"
Content-Type: application/pdf

[binary file content]
--boundary
Content-Disposition: form-data; name="files"; filename="image.jpg"
Content-Type: image/jpeg

[binary file content]
--boundary--
```

### Response
```json
{
  "status": "success",
  "message": "Email sent successfully",
  "email_id": "12345"
}
```

### Error Responses
```json
{
  "status": "error",
  "detail": "Invalid email format"
}
```

Status codes:
- 200: Success
- 400: Bad request (file type, invalid email)
- 413: Payload too large (file > 25MB)
- 422: Unprocessable (validation error)
- 500: Server error

## Email Model Schema

### Python (Pydantic)
```python
class AttachmentInfo(BaseModel):
    filename: str
    content_type: str
    content: str  # base64 encoded
    size: int

class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body_text: str
    body_html: Optional[str] = None
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None
    attachments: Optional[List[AttachmentInfo]] = None

class EmailResponse(BaseModel):
    status: str
    message: str
    email_id: Optional[str] = None
```

## File Upload Processing

### Client Side (FileUploadDropzone)
```
Files dropped/selected
    ↓
Validate per file:
├─ Size check (max 25MB)
├─ MIME type check (whitelist)
└─ Count check (max 10 files)
    ↓
Create attachment state:
{
  file: File,
  id: string,
  error?: string
}
    ↓
Separate valid & error files
    ↓
onFilesChange([valid File objects])
```

### Server Side (email.py endpoint)
```
Receive UploadFile list
    ↓
For each file:
├─ Read content as bytes
├─ Validate size (< 25MB)
├─ Validate MIME type (whitelist)
├─ Base64 encode content
└─ Create AttachmentInfo dict
    ↓
Pass to email_service.send_email()
```

### Email Service Processing
```
Receive AttachmentInfo objects
    ↓
For each attachment:
├─ Base64 decode content
├─ Create SendSmtpEmailAttachment
│   ├── name: filename
│   ├── content: decoded bytes
│   └── content_type: MIME type
└─ Add to attachment list
    ↓
Pass to Brevo SDK
```

## State Management Flow

### EmailForm State
```typescript
interface FormDataState {
  to: string                    // "user@example.com"
  subject: string               // "Hello World"
  bodyHtml: string              // "<p>HTML content</p>"
  bodyText: string              // "Plain text content"
  cc: string                    // "cc@example.com, cc2@example.com"
  bcc: string                   // "bcc@example.com"
  attachments: File[]           // Array of File objects
}
```

### Notifications
```typescript
interface Notification {
  id: string                    // Unique identifier
  type: "success" | "error" | "info"
  message: string               // User message
}
```

## Component Props

### RichEmailEditor
```typescript
interface RichEmailEditorProps {
  value: string                 // Current HTML content
  onChange: (html: string, text: string) => void
}
```

### FileUploadDropzone
```typescript
interface FileUploadDropzoneProps {
  onFilesChange: (files: File[]) => void
  maxSize?: number              // Default: 25MB
  maxFiles?: number             // Default: 10
  acceptedFormats?: string[]    // Optional: specific MIME types
}
```

### RichEmailEditorContent
```typescript
interface RichEmailEditorContentProps {
  value: string                 // Current HTML content
  onChange: (html: string, text: string) => void
}
```

## Validation Rules

### Email Validation
```
Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Must have @ symbol
- Must have domain
- No spaces allowed
- Real-time validation feedback
```

### File Validation
```
Size: max 25 * 1024 * 1024 bytes (25MB)
Count: max 10 files per email
Types: Whitelist of MIME types
├── Images: image/jpeg, image/png, image/gif, image/webp
├── Docs: application/pdf, application/msword, ...
├── Text: text/plain, text/csv
└── Archives: application/zip, application/x-rar, ...
```

### Form Validation
```
to: required + valid email
subject: required + non-empty
body_text: required (plain text minimum)
body_html: optional (HTML alternative)
cc: optional + valid emails if provided
bcc: optional + valid emails if provided
attachments: optional + validated per file
terms: required checkbox
```

## Error Handling Strategy

```
User Action
    ↓
Try-Catch Block
├── Success
│   ├─ addNotification("success", message)
│   ├─ Reset form
│   └─ Clear notifications after 5s
│
└── Error
    ├─ Parse error response
    ├─ Extract user-friendly message
    ├─ addNotification("error", message)
    ├─ Log to console (dev)
    └─ Keep form data (user can retry)
```

## Performance Optimizations

### Bundle Size
- TipTap dynamically imported (loaded only when needed)
- Prose CSS tree-shaken in production
- React-dropzone includes only necessary files

### Runtime
- FormData used instead of JSON (efficient file handling)
- File validation happens on client (reduces server load)
- Base64 encoding on client (offloads server processing)
- Debounced editor updates (prevents excessive re-renders)

### User Experience
- Optimistic UI updates (instant feedback)
- Lazy-loaded editor component
- Smooth loading states
- Auto-dismiss notifications (after 5s)

## Brevo SDK Integration

```python
from brevo_python import ApiClient, Configuration
from brevo_python.api.transactional_emails_api import TransactionalEmailsApi
from brevo_python.model.send_smtp_email import SendSmtpEmail
from brevo_python.model.send_smtp_email_cc import SendSmtpEmailCc
from brevo_python.model.send_smtp_email_bcc import SendSmtpEmailBcc
from brevo_python.model.send_smtp_email_attachment import SendSmtpEmailAttachment

# Usage
email = SendSmtpEmail(
    to=[SendSmtpEmailTo(email="to@example.com")],
    sender=SendSmtpEmailSender(email="from@example.com"),
    subject="Subject",
    html_content="<p>HTML</p>",
    text_content="Text",
    cc=[SendSmtpEmailCc(email="cc@example.com")],
    bcc=[SendSmtpEmailBcc(email="bcc@example.com")],
    attachment=[
        SendSmtpEmailAttachment(
            name="file.pdf",
            content=base64_encoded_content,
            content_type="application/pdf"
        )
    ]
)

api_instance.send_transac_email(email)
```

## Dependencies & Versions

```json
{
  "@tiptap/react": "^3.7.2",
  "@tiptap/starter-kit": "^3.7.2",
  "@tiptap/extension-image": "^3.7.2",
  "react-dropzone": "^14.3.8"
}
```

With existing dependencies:
- React: ^18
- Next.js: ^14
- Tailwind CSS: ^3
- Framer Motion: ^10

## Browser Compatibility

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS Safari 14+, Chrome Android latest

Polyfills needed: None (all modern APIs used)
