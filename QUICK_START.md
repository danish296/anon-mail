# 🚀 Quick Start Guide - Gmail-Like Email Features

## What You Have Now

A **professional email composition system** with:
- ✨ **Rich Text Formatting** (bold, italic, lists, headings, images)
- 📎 **File Attachments** (up to 10 files, 25MB each)
- 👥 **CC & BCC Recipients** (fully functional)
- 🎨 **Modern UI** with smooth animations
- ⚡ **AI Email Generation** (existing feature still works)
- 🔒 **Comprehensive Validation** (files, emails, content)

---

## Installation & Setup

### 1️⃣ Frontend Setup
```bash
# Navigate to project
cd v0-ai-service-landing-page-main

# Install dependencies (already done if pnpm.lock exists)
pnpm install

# Start dev server
pnpm dev
```
✅ Frontend runs at: **http://localhost:3000**

### 2️⃣ Backend Setup
```bash
# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Copy env.example to .env and add your API keys:
# BREVO_API_KEY=your_key_here
# OPENAI_API_KEY=your_key_here

# Start backend server
python run_server.py
```
✅ Backend runs at: **http://127.0.0.1:8000**

---

## Using the Email Form

### Basic Workflow

1. **Enter Recipient Email**
   - Valid email format required
   - Real-time validation with error feedback

2. **Add Subject Line**
   - Required field
   - Any text allowed

3. **Optional: Add CC/BCC**
   - Enter comma-separated emails: `email1@example.com, email2@example.com`
   - Both fields optional
   - Empty fields are fine

4. **Compose Email Body**
   - Use the **rich text editor** toolbar:
     - **B** = Bold
     - **I** = Italic
     - **Heading** = Large heading
     - **•** = Bullet list
     - **1.** = Numbered list
     - **Image** = Insert image from URL
     - **↶** = Undo
     - **↷** = Redo

5. **Optional: Add Attachments**
   - **Drag files** onto the dropzone OR
   - **Click** to select files
   - Maximum **10 files**
   - Maximum **25MB** per file
   - See list of added files below the dropzone

6. **Review & Send**
   - Check all information
   - Accept Terms of Service checkbox
   - Click **"Send Email"**
   - Green success notification confirms send

---

## Feature Highlights

### Rich Text Editor
```
┌─────────────────────────────┐
│ [B] [I] | [Heading] [•][1.] │  ← Click buttons for formatting
├─────────────────────────────┤
│ Type your email here...      │
│ This will be formatted       │
│ as both HTML & plain text    │
└─────────────────────────────┘
```
- **HTML Version**: Rendered in modern email clients
- **Plain Text**: Fallback for older clients
- **Automatic**: Both generated from editor content

### File Attachments
```
┌─────────────────────────────────────┐
│ Drag files here or click to select   │
├─────────────────────────────────────┤
│ ✓ document.pdf   (2.3 MB)        [X]│
│ ✓ image.jpg      (1.5 MB)        [X]│
│ ✓ spreadsheet.xlsx (508 KB)      [X]│
└─────────────────────────────────────┘
```
- Click **[X]** to remove individual files
- Supports: **PDFs, images, Office docs, text files, archives**
- File size and type validated automatically

### CC & BCC Recipients
```
┌──────────────────────────────────────────────────┐
│ CC: cc1@example.com, cc2@example.com, cc3@ex... │
├──────────────────────────────────────────────────┤
│ BCC: boss@example.com                           │
└──────────────────────────────────────────────────┘
```
- **CC**: Visible to all recipients (can see other recipients)
- **BCC**: Hidden (other recipients can't see)
- Both optional - leave blank if not needed
- Supports unlimited recipients (comma-separated)

---

## Troubleshooting

### "Rich Editor Not Showing"
**Solution**: 
1. Refresh the page (Ctrl+R or Cmd+R)
2. Check browser console for errors (F12 → Console tab)
3. Ensure JavaScript is enabled

### "File Too Large" Error
**Solution**: 
- Maximum file size is 25MB
- Split into smaller files or
- Use cloud storage links instead

### "File Type Not Supported" Error
**Solution**: 
- Supported types: Images (JPG, PNG, GIF, WebP), PDFs, Office docs (Word, Excel, PowerPoint), Text files, Archives (ZIP, RAR, 7Z)
- Convert file to supported format

### "Email Not Sending"
**Solution**:
1. Check recipient email is valid
2. Verify backend is running (`python run_server.py`)
3. Check API keys in `.env` file are correct
4. Check browser console and backend logs for specific error
5. Wait 5-10 seconds and try again (rate limiting may apply)

### "Attachment Not Appearing in Email"
**Solution**:
1. File list shows attachment in preview? If not, re-add
2. File size under 25MB? If not, resize/compress
3. File type supported? Check list above
4. Check spam folder - attachments may trigger spam filters

---

## Advanced Usage

### Keyboard Shortcuts
- **Ctrl+B** / **Cmd+B**: Bold text
- **Ctrl+I** / **Cmd+I**: Italic text
- **Ctrl+Z** / **Cmd+Z**: Undo
- **Ctrl+Shift+Z** / **Cmd+Shift+Z**: Redo

### Copying Email Body
- **"Copy Body"** button appears when body has text
- Copies plain text version to clipboard
- Useful for email templates or records

### AI Email Generation
- Enter subject line first
- Click **"Generate with AI"** button
- Wait for AI to create body (2-3 seconds)
- Edit as needed, then send

### Terms of Service
- Checkbox required to send
- Links to `/terms` page
- Accept once per session

---

## File Type Reference

| Category | Formats | Notes |
|----------|---------|-------|
| **Images** | .jpg, .jpeg, .png, .gif, .webp | Email clients display inline |
| **Documents** | .pdf | Universal support |
| **Word** | .doc, .docx | Microsoft Word |
| **Excel** | .xls, .xlsx | Spreadsheets |
| **PowerPoint** | .ppt, .pptx | Presentations |
| **Text** | .txt | Plain text |
| **Data** | .csv | Comma-separated values |
| **Archives** | .zip, .rar, .7z | Compressed files |

---

## Email Recipients

### Valid Formats
```
✅ user@example.com
✅ john.doe@company.co.uk
✅ noreply+tag@service.io
```

### Invalid Formats
```
❌ user@example        (missing TLD)
❌ @example.com        (missing username)
❌ user@.com           (missing domain)
❌ user name@exam.com  (spaces not allowed)
```

---

## API Reference (For Developers)

### Send Email Endpoint
```http
POST /send-email
Content-Type: multipart/form-data

Parameters:
- to (required): recipient@example.com
- subject (required): Email subject
- body_text (required): Plain text version
- body_html (optional): HTML version
- cc (optional): email1@example.com, email2@example.com
- bcc (optional): hidden@example.com
- files (optional): Multiple file uploads (max 10, 25MB each)
```

### Response
```json
{
  "status": "success",
  "message": "Email sent successfully",
  "email_id": "abc123"
}
```

---

## Performance Tips

### Faster Form Submission
1. Pre-write emails as templates
2. Use AI generation for body
3. Add attachments last
4. Keep file sizes small (<5MB each)

### Best Practices
- Test emails to yourself first
- Verify formatting renders in recipient's email client
- Use descriptive file names
- Keep CC/BCC lists reasonable
- Archive sent emails for records

---

## Getting Help

### Check These Resources
1. **FEATURE_IMPLEMENTATION.md** - Detailed features guide
2. **BEFORE_AFTER_COMPARISON.md** - What changed from basic form
3. **ARCHITECTURE_REFERENCE.md** - Technical architecture
4. **Backend logs** - Run: `python run_server.py` with errors
5. **Browser console** - F12 → Console tab for frontend errors

### Common Paths
- **Form component**: `components/email-form.tsx`
- **Rich editor**: `components/rich-email-editor.tsx`
- **File uploader**: `components/file-upload-dropzone.tsx`
- **API endpoint**: `app/api/routes/email.py`
- **Email service**: `app/services/email_service.py`

---

## Keyboard Navigation

Press **Tab** to navigate through:
1. Recipient email input
2. Subject input
3. CC field
4. BCC field
5. Rich text editor
6. File dropzone
7. Terms checkbox
8. Action buttons

---

## What's Next?

### Future Ideas
- 📅 **Schedule Send**: Send emails at specific times
- 📨 **Email Templates**: Save and reuse templates
- 🔄 **Batch Send**: Send to multiple recipients
- 👁️ **Preview**: WYSIWYG preview before sending
- 📝 **Signature**: Add custom email signature
- ⏱️ **Schedule**: Set delivery time
- 🔗 **Link Preview**: Show link information
- ✍️ **Spell Check**: Built-in spell checking

---

## Important Notes

⚠️ **Backend Required**
- Frontend form won't send without backend running
- Ensure `http://127.0.0.1:8000` is accessible
- Check backend terminal for error logs

⚠️ **API Keys Required**
- Set `BREVO_API_KEY` in `.env` for email sending
- Set `OPENAI_API_KEY` in `.env` for AI generation
- Missing keys will cause errors

⚠️ **Rate Limiting**
- Brevo may rate limit if sending too many emails
- Wait 1-2 seconds between sends
- Check error message for specific limits

---

## Status Check

### Verify Everything Works

1. **Frontend Running?**
   ```bash
   # Should see: ✓ Ready in Xs
   # Access: http://localhost:3000
   ```

2. **Backend Running?**
   ```bash
   # Should see: Uvicorn running on http://127.0.0.1:8000
   # Check: http://127.0.0.1:8000/docs
   ```

3. **Form Displays?**
   - Visit http://localhost:3000
   - Should see email form with:
     - Recipient & Subject inputs
     - CC & BCC fields
     - Rich text editor with toolbar
     - File dropzone
     - Send button

4. **Try Sending?**
   - Enter your email as recipient
   - Type simple subject
   - Type simple message (or use AI)
   - Click Send Email
   - Check for success notification

---

## Success! 🎉

You now have a fully functional Gmail-like email composition system!

**Ready to use** → Start at http://localhost:3000
**Questions?** → Check documentation files
**Issues?** → Check browser console + backend logs

Happy email composing! 📧
