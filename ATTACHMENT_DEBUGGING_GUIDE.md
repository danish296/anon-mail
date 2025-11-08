# Email Attachments Debugging Guide

## Issue Reported
Emails are not receiving attachments even though files are being uploaded through the form.

## Fixes Applied

### 1. Enhanced Frontend Logging
Added detailed console logging to track attachment processing:

**Location**: `components/email-form.tsx`

```typescript
// Logs each attachment before adding to FormData
console.log("Processing attachments:", formData.attachments)
formData.attachments.forEach((file, index) => {
  console.log(`Attachment ${index}:`, {
    name: file.name,
    size: file.size,
    type: file.type
  })
  // ...
})

// Logs all FormData entries including files
console.log("FormData entries:")
for (let pair of submitData.entries()) {
  if (pair[1] instanceof File) {
    console.log(pair[0], ':', { name: pair[1].name, size: pair[1].size, type: pair[1].type })
  } else {
    console.log(pair[0], ':', pair[1])
  }
}
```

### 2. Enhanced Backend Logging
Added comprehensive logging throughout the attachment processing pipeline:

**Location**: `app/api/routes/email.py`

```python
# Log received files
logger.info(f"Received {len(files)} file(s)")
for idx, f in enumerate(files):
    logger.info(f"File {idx}: filename={f.filename}, content_type={f.content_type}, size={f.size}")

# Log attachment processing
logger.info(f"Processing attachment: {file.filename}, size: {file.size}, type: {file.content_type}")
logger.info(f"Read {len(content)} bytes from {file.filename}")
logger.info(f"Base64 encoded {file.filename}, length: {len(content_b64)}")
logger.info(f"Added attachment: {file.filename}")
logger.info(f"Total attachments processed: {len(attachments)}")
```

**Location**: `app/services/email_service.py`

```python
# Log Brevo API attachment processing
logger.info(f"Processing {len(attachments)} attachments for email")
logger.info(f"Processing attachment: {attachment['filename']}, type: {attachment['content_type']}")
logger.info(f"Decoded {len(content_bytes)} bytes for {attachment['filename']}")
logger.info(f"Added attachment to email: {attachment['filename']}")
logger.info(f"Total attachments added to email: {len(attachment_list)}")
```

## How to Debug

### Step 1: Check Frontend Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Upload a file and send an email
4. Look for:
   ```
   Processing attachments: [File objects]
   Attachment 0: { name: "...", size: ..., type: "..." }
   FormData entries:
   files : { name: "...", size: ..., type: "..." }
   ```

### Step 2: Check Backend Logs
Look in the terminal where the backend is running for:

```
INFO: Received 1 file(s)
INFO: File 0: filename=test.pdf, content_type=application/pdf, size=12345
INFO: Processing attachment: test.pdf, size: 12345, type: application/pdf
INFO: Read 12345 bytes from test.pdf
INFO: Base64 encoded test.pdf, length: 16460
INFO: Added attachment: test.pdf
INFO: Total attachments processed: 1
INFO: Processing 1 attachments for email
INFO: Processing attachment: test.pdf, type: application/pdf
INFO: Decoded 12345 bytes for test.pdf
INFO: Added attachment to email: test.pdf
INFO: Total attachments added to email: 1
INFO: Sending email to user@example.com with subject: Test
INFO: Attachments: 1 file(s)
```

### Step 3: Common Issues to Check

#### Issue 1: Files Not Sent from Frontend
**Symptom**: Backend logs show "Received 0 file(s)"
**Possible Causes**:
- FileUploadDropzone not passing files correctly
- FormData not including files
- Files filtered out due to validation

**Check**: Browser console should show files in FormData entries

#### Issue 2: Files Rejected by Backend
**Symptom**: Backend logs show files received but not processed
**Possible Causes**:
- MIME type not in ALLOWED_MIME_TYPES
- File size exceeds MAX_ATTACHMENT_SIZE (25MB)
- Empty file (size = 0)

**Check**: Look for warning logs about skipped files

#### Issue 3: Files Not Sent to Brevo
**Symptom**: Backend processes files but email has no attachments
**Possible Causes**:
- Brevo API error (check API response)
- Base64 encoding issue
- attachment_list not properly added to email_data

**Check**: Look for "Total attachments added to email" log

#### Issue 4: Brevo API Rejects Attachments
**Symptom**: Email sent but attachments missing
**Possible Causes**:
- Brevo account limits
- Invalid attachment format
- Content-Type header issue

**Check**: Brevo API response and account dashboard

## Allowed File Types

```python
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-rar-compressed'
}
```

## File Size Limits
- Per file: 25 MB
- Total: No explicit limit, but Brevo has email size limits

## Testing Procedure

### Test 1: Single Small File
1. Upload a small PDF (< 1 MB)
2. Send email
3. Check recipient inbox
4. Verify attachment is present and can be downloaded

### Test 2: Multiple Files
1. Upload 2-3 different file types (PDF, image, doc)
2. Send email
3. Check recipient inbox
4. Verify all attachments are present

### Test 3: Large File
1. Upload a file close to 25 MB limit
2. Send email
3. Should succeed and deliver attachment

### Test 4: Invalid File Type
1. Upload a file type not in ALLOWED_MIME_TYPES (e.g., .exe)
2. Should show error in dropzone or be rejected by backend

### Test 5: Edge Cases
1. Upload file, remove it, upload another, send
2. Upload files, clear form, upload new files, send
3. Upload files with special characters in filename

## Quick Fix Checklist

If attachments still don't work after logging is added:

- [ ] Check browser console for file upload errors
- [ ] Check backend logs show files being received
- [ ] Verify MIME types are allowed
- [ ] Verify file sizes are under 25 MB
- [ ] Check Brevo API key is valid
- [ ] Check Brevo account limits/quotas
- [ ] Test with a simple file (small PDF)
- [ ] Check email client isn't filtering attachments
- [ ] Verify attachments appear in Brevo dashboard

## Potential Solutions

### Solution 1: MIME Type Issue
If files are being rejected due to MIME type, add the type to ALLOWED_MIME_TYPES:

```python
# In app/services/email_service.py
ALLOWED_MIME_TYPES = {
    # ... existing types ...
    'application/octet-stream',  # Generic binary
    'your/mime-type',  # Add specific type
}
```

### Solution 2: Brevo Account Limits
- Check Brevo dashboard for any warnings
- Verify account is not in free tier with attachment restrictions
- Contact Brevo support if attachments are blocked

### Solution 3: Content-Type Issue
The Brevo SDK expects base64 content as a string. This is correctly implemented:

```python
attachment_obj = SendSmtpEmailAttachment(
    name=attachment['filename'],
    content=attachment['content'],  # base64 string
    content_type=attachment['content_type']
)
```

### Solution 4: File Reading Issue
If files aren't being read properly:

```python
# Ensure file is fully read
content = await file.read()
# Reset file pointer if needed to read again
await file.seek(0)
```

## Contact Information

If issue persists after following this guide:
1. Collect browser console logs
2. Collect backend terminal logs
3. Try sending test email through Brevo dashboard directly
4. Check Brevo API documentation: https://developers.brevo.com/

## Files Modified for Debugging

1. `components/email-form.tsx` - Added frontend logging
2. `app/api/routes/email.py` - Added API endpoint logging
3. `app/services/email_service.py` - Added email service logging

All logging can be removed after debugging by searching for the log statements added.
