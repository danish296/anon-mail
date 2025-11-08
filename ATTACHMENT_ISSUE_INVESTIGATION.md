# Email Attachments Not Received - Investigation & Fix

## Issue Report
**Date**: October 18, 2025  
**Problem**: Emails do not receive attachments even though files are uploaded through the form.

## Investigation Approach

Since the code logic appears correct (frontend sends files → backend processes → Brevo API delivers), I've added comprehensive logging throughout the entire attachment pipeline to identify where attachments are being lost.

## Changes Made

### 1. Frontend Logging (`components/email-form.tsx`)

Added detailed console logging to track:
- Files in formData.attachments array
- Each file's name, size, and type
- Files being added to FormData
- All FormData entries before submission

**What to look for in browser console:**
```javascript
Processing attachments: [File {...}]
Attachment 0: { name: "document.pdf", size: 54321, type: "application/pdf" }
Added file 0 to FormData: document.pdf
FormData entries:
files : { name: "document.pdf", size: 54321, type: "application/pdf" }
```

### 2. Backend API Logging (`app/api/routes/email.py`)

Added logging to track:
- Number of files received from frontend
- Each file's metadata (filename, content_type, size)
- File content reading (bytes read)
- Base64 encoding (encoded length)
- Total attachments processed

**What to look for in backend terminal:**
```
INFO: Received 1 file(s)
INFO: File 0: filename=document.pdf, content_type=application/pdf, size=54321
INFO: Processing attachment: document.pdf, size: 54321, type: application/pdf
INFO: Read 54321 bytes from document.pdf
INFO: Base64 encoded document.pdf, length: 72428
INFO: Added attachment: document.pdf
INFO: Total attachments processed: 1
```

### 3. Email Service Logging (`app/services/email_service.py`)

Added logging to track:
- Number of attachments being processed for Brevo
- Each attachment's validation
- Base64 decoding verification
- Attachment objects creation
- Total attachments added to email

**What to look for in backend terminal:**
```
INFO: Processing 1 attachments for email
INFO: Processing attachment: document.pdf, type: application/pdf
INFO: Decoded 54321 bytes for document.pdf
INFO: Added attachment to email: document.pdf
INFO: Total attachments added to email: 1
INFO: Sending email to user@example.com with subject: Test
INFO: Attachments: 1 file(s)
```

## How to Debug the Issue

### Step 1: Test with Logging
1. **Start backend server**: `py run_server.py`
2. **Start frontend**: `pnpm dev` (should already be running on port 3000)
3. **Open browser console** (F12 → Console tab)
4. **Upload a test file** (e.g., a small PDF or image)
5. **Fill in email form** and click "Send Email"
6. **Check browser console** for frontend logs
7. **Check backend terminal** for backend logs

### Step 2: Identify Where Attachments Are Lost

The logs will show one of these scenarios:

#### Scenario A: Files Not Sent from Frontend
**Symptom**: Backend shows "Received 0 file(s)"  
**Cause**: Frontend not properly adding files to FormData  
**Solution**: Check FileUploadDropzone component state management

#### Scenario B: Files Received but Not Processed
**Symptom**: Backend shows files received but "Total attachments processed: 0"  
**Possible Causes**:
- File MIME type not in ALLOWED_MIME_TYPES
- File size exceeds 25 MB limit
- Empty file (size = 0)
**Solution**: Check backend warning logs for rejection reasons

#### Scenario C: Files Processed but Not Added to Email
**Symptom**: Backend shows attachments processed but "Total attachments added to email: 0"  
**Possible Causes**:
- Validation failure in email service
- MIME type mismatch
**Solution**: Check email service warning logs

#### Scenario D: Files Added but Email Has No Attachments
**Symptom**: All logs show success but recipient doesn't receive attachments  
**Possible Causes**:
- Brevo API issue
- Brevo account limitations
- Email client filtering attachments
**Solution**: 
1. Check Brevo dashboard for sent emails
2. Verify attachments show in Brevo interface
3. Try different email client
4. Check Brevo account limits

## Testing Checklist

After the logging is in place, test these scenarios:

- [ ] **Test 1**: Upload single small PDF (< 1 MB), send email
  - Check: Browser console shows file
  - Check: Backend logs show file received and processed
  - Check: Recipient receives email with attachment

- [ ] **Test 2**: Upload image file (PNG/JPEG), send email
  - Check: Same logging verification
  - Check: Attachment visible in email

- [ ] **Test 3**: Upload multiple files (2-3 different types)
  - Check: All files logged in console and backend
  - Check: All attachments in received email

- [ ] **Test 4**: Upload large file (close to 25 MB)
  - Check: Processing completes successfully
  - Check: Attachment delivered

- [ ] **Test 5**: Upload invalid file type (e.g., .exe)
  - Check: Should be rejected with clear error

## Common Issues & Solutions

### Issue 1: MIME Type Not Allowed
**Log**: `WARNING: File type {type} not allowed`  
**Fix**: Add the MIME type to `ALLOWED_MIME_TYPES` in `email_service.py`

### Issue 2: File Size Too Large
**Log**: `File {filename} exceeds max size`  
**Fix**: Either compress the file or increase `MAX_ATTACHMENT_SIZE` (if Brevo allows)

### Issue 3: Brevo API Error
**Log**: `Brevo API error: {error}`  
**Fix**: Check Brevo account status, API key validity, and rate limits

### Issue 4: Base64 Encoding Issue
**Log**: `Failed to process attachment {filename}: {error}`  
**Fix**: Verify file is being read correctly and encoding succeeds

## Next Steps

1. **Run the test** with logging enabled
2. **Collect logs** from both browser console and backend terminal
3. **Identify the bottleneck** using the scenarios above
4. **Apply the appropriate fix** based on findings

## Brevo Attachment Requirements

According to Brevo API documentation:
- Attachments must be base64 encoded
- Content should be string, not binary
- Filename must be provided
- Content-Type should be specified
- Maximum email size including attachments: typically 25-50 MB

Our implementation follows these requirements:
```python
SendSmtpEmailAttachment(
    name=attachment['filename'],           # ✓ Filename
    content=attachment['content'],         # ✓ Base64 string
    content_type=attachment['content_type'] # ✓ Content-Type
)
```

## Files Modified

1. **`components/email-form.tsx`**
   - Added console.log for attachments array
   - Added console.log for each file being processed
   - Added console.log for FormData entries
   - Lines added: ~20 lines of logging

2. **`app/api/routes/email.py`**
   - Added logger.info for files received count
   - Added logger.info for each file's metadata
   - Added logger.info for processing steps
   - Added logger.info for total attachments
   - Lines added: ~10 lines of logging

3. **`app/services/email_service.py`**
   - Added logger.info for attachment processing
   - Added logger.info for validation steps
   - Added logger.info for each attachment added
   - Added logger.info for total count
   - Lines added: ~15 lines of logging

## Cleanup

After identifying and fixing the issue, you can remove the debug logging by searching for:
- `console.log` statements in email-form.tsx
- `logger.info` statements added for debugging

Or keep them for future debugging needs (they don't impact performance significantly).

## Results

After running the tests with logging, please report:
1. What the browser console shows
2. What the backend logs show
3. Whether attachments are received in the email

This will help pinpoint the exact location of the issue and apply the correct fix.

---

**Status**: Logging infrastructure added, ready for testing  
**Action Required**: Run test and collect logs to identify issue location
