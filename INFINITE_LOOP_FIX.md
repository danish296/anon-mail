# Infinite Loop Fix - FileUploadDropzone

## Issue: Maximum Update Depth Exceeded

**Error**: "Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."

## Root Cause

The `useEffect` that calls `onFilesChange` had `onFilesChange` in its dependency array:

```typescript
// ❌ PROBLEM: onFilesChange recreated on every render
useEffect(() => {
  const validFiles = attachments
    .filter((a) => !a.error)
    .map((a) => a.file)
  onFilesChange(validFiles)  // Calls parent setState
}, [attachments, onFilesChange])  // onFilesChange changes every render!
```

### Why This Caused an Infinite Loop:

1. `FileUploadDropzone` renders
2. `useEffect` runs and calls `onFilesChange(validFiles)`
3. `onFilesChange` calls parent's `setFormData({ ...formData, attachments: files })`
4. Parent (`EmailForm`) re-renders
5. `onFilesChange` callback is recreated (new reference)
6. `FileUploadDropzone` receives new `onFilesChange` prop
7. `useEffect` dependency changes, runs again
8. **Goto step 2** → Infinite loop! 🔄

## Solution: Use `useRef` to Stabilize Callback

Fixed by using `useRef` to store the latest callback without triggering re-renders:

```typescript
// ✅ SOLUTION: Use ref to avoid dependency on changing callback
const onFilesChangeRef = useRef(onFilesChange)

// Update ref when callback changes (doesn't trigger effect below)
useEffect(() => {
  onFilesChangeRef.current = onFilesChange
}, [onFilesChange])

// Notify parent - only depends on attachments, not the callback
useEffect(() => {
  const validFiles = attachments
    .filter((a) => !a.error)
    .map((a) => a.file)
  onFilesChangeRef.current(validFiles)  // Use ref, not prop
}, [attachments])  // Only attachments in deps, no infinite loop!
```

## Additional Fix: Prevent Value Prop Loop

Also fixed the value sync effect to only depend on `value.length`:

```typescript
// Before: ❌ Could cause issues
useEffect(() => {
  if (value.length === 0 && attachments.length > 0) {
    setAttachments([])
  }
}, [value, attachments.length])  // value array changes reference

// After: ✅ Only check length
useEffect(() => {
  if (value.length === 0 && attachments.length > 0) {
    setAttachments([])
  }
}, [value.length])  // Only length, more stable
```

## How useRef Solves This

### What `useRef` Does:
- Creates a **mutable container** that persists across renders
- Changing `.current` **doesn't trigger re-renders**
- Always returns the same ref object

### Pattern:
```typescript
const callbackRef = useRef(callback)

// Update ref when callback changes
useEffect(() => {
  callbackRef.current = callback
}, [callback])

// Use ref in other effects - no dependency on callback!
useEffect(() => {
  callbackRef.current(someData)
}, [someData])  // callback not in deps!
```

## Files Modified

**`components/file-upload-dropzone.tsx`**:
1. Added `useRef` import
2. Created `onFilesChangeRef` to store callback
3. Added effect to update ref when callback changes
4. Changed `onFilesChange` to `onFilesChangeRef.current`
5. Removed `onFilesChange` from effect dependencies
6. Changed `value` to `value.length` in sync effect

## Benefits

✅ **No more infinite loops**
✅ **Stable effect dependencies**  
✅ **Proper separation of concerns**  
✅ **Better performance** (fewer re-renders)  
✅ **Always uses latest callback** (via ref)

## React Pattern: Stable Callback References

This is a common React pattern for handling callbacks in effects:

```typescript
// Problem: Callback changes on every render
function Parent() {
  const [state, setState] = useState()
  
  // ❌ New function on every render
  const onChange = (value) => {
    setState({ ...state, value })
  }
  
  return <Child onChange={onChange} />
}

// Solution 1: Use useCallback
const onChange = useCallback((value) => {
  setState(prev => ({ ...prev, value }))
}, [])  // Empty deps with functional update

// Solution 2: Use useRef in child (our approach)
function Child({ onChange }) {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  
  useEffect(() => {
    onChangeRef.current(data)  // Stable!
  }, [data])
}
```

## Testing

After this fix:
- ✅ No console warnings/errors
- ✅ File upload works correctly
- ✅ Parent receives file updates
- ✅ Form doesn't reset on file upload
- ✅ No performance issues
- ✅ App remains responsive

## Status

**Fixed**: October 18, 2025  
**Issue**: Infinite loop causing "Maximum update depth exceeded"  
**Solution**: Use `useRef` to stabilize callback reference  
**Result**: App running smoothly without warnings ✅
