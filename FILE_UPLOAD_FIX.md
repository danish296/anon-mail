# File Upload Form Reset Fix

## Issue Fixed (October 18, 2025)

### ✅ Form Completely Resets When Image/File is Uploaded

**Problem**: When a user uploaded a file via the FileUploadDropzone component, the entire form would reset, clearing all fields (recipient email, subject, body, etc.).

**Root Cause**: 
1. The `onDrop` callback in `FileUploadDropzone` had `attachments` in its dependency array
2. This caused the callback to be recreated every time files were added
3. React's `useDropzone` was being re-initialized, causing unwanted re-renders
4. The component didn't properly sync with parent state when form was cleared

**Solution**:

### 1. Fixed State Update Pattern
Changed from direct state mutation to functional state updates:

**Before:**
```typescript
const onDrop = useCallback(
  (acceptedFiles: File[], rejectedFiles: any[]) => {
    let newAttachments = [...attachments]  // ❌ Depends on stale state
    // ... process files
    setAttachments(newAttachments)
  },
  [attachments, maxFiles, maxSize]  // ❌ attachments in deps causes re-creation
)
```

**After:**
```typescript
const onDrop = useCallback(
  (acceptedFiles: File[], rejectedFiles: any[]) => {
    setAttachments((prevAttachments) => {  // ✅ Functional update
      let newAttachments = [...prevAttachments]
      // ... process files
      return newAttachments
    })
  },
  [maxFiles, maxSize, onFilesChange]  // ✅ No attachments dependency
)
```

### 2. Added Value Prop for Controlled Component
Made the FileUploadDropzone a controlled component that syncs with parent state:

```typescript
interface FileUploadDropzoneProps {
  onFilesChange: (files: File[]) => void
  value?: File[]  // ✅ NEW: Control component from parent
  // ... other props
}

export function FileUploadDropzone({
  value = [],  // ✅ Default to empty array
  // ... other props
}: FileUploadDropzoneProps) {
  // ✅ Sync with parent when it clears
  useEffect(() => {
    if (value.length === 0 && attachments.length > 0) {
      setAttachments([])
    }
  }, [value])
  
  // ...
}
```

### 3. Updated Parent Component
Pass the current attachments as value prop:

**email-form.tsx:**
```typescript
<FileUploadDropzone
  value={formData.attachments}  // ✅ Pass current state
  onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
/>
```

### 4. Fixed removeAttachment Function
Also updated to use functional state updates:

**Before:**
```typescript
const removeAttachment = (id: string) => {
  const updated = attachments.filter((a) => a.id !== id)  // ❌ Stale state
  setAttachments(updated)
  // ...
}
```

**After:**
```typescript
const removeAttachment = (id: string) => {
  setAttachments((prevAttachments) => {  // ✅ Functional update
    const updated = prevAttachments.filter((a) => a.id !== id)
    onFilesChange(validFiles)
    return updated
  })
}
```

## Benefits of This Fix

1. **No More Form Resets**: Form fields stay intact when uploading files
2. **Better Performance**: Fewer unnecessary re-renders
3. **Proper State Sync**: Component properly clears when form is submitted
4. **Stable Callbacks**: `onDrop` is not recreated on every file addition
5. **Controlled Component**: Parent has full control over the file list

## Technical Details

### Why Functional Updates?
Using `setState((prev) => ...)` instead of `setState(value)` ensures:
- Always working with the latest state
- Prevents stale closure issues
- More predictable behavior in async operations

### Why Remove `attachments` from Dependencies?
- Having `attachments` in the `useCallback` dependency array caused the callback to be recreated on every file addition
- This triggered `useDropzone` to reinitialize
- Led to unexpected re-renders and form resets

### Why Add `value` Prop?
- Makes the component "controlled" like standard form inputs
- Parent component (email-form) maintains single source of truth
- When parent resets form, child component automatically clears
- Better data flow: parent → child (value) → parent (onChange)

## Testing Checklist

- [x] Upload a single file - form fields remain filled
- [x] Upload multiple files - form fields remain filled
- [x] Remove a file - form fields remain filled
- [x] Upload files, then send email - form clears including file list
- [x] Upload files after form reset - starts fresh with new files
- [x] Drag and drop files - form fields remain filled
- [x] Click to select files - form fields remain filled

## Files Modified

1. **components/file-upload-dropzone.tsx**
   - Added `useEffect` import
   - Added `value` prop to interface
   - Added `useEffect` to sync with parent state
   - Changed `onDrop` to use functional state updates
   - Removed `attachments` from dependency array
   - Changed `removeAttachment` to use functional state updates

2. **components/email-form.tsx**
   - Added `value={formData.attachments}` prop to FileUploadDropzone

## Related Fixes

This fix builds on the previous editor fixes:
- Editor content sync (useEffect for value prop)
- Toolbar button focus prevention (onMouseDown)
- Placeholder implementation
- Image configuration

All form components now follow the controlled component pattern with proper state management.
