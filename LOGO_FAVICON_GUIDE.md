# 🎨 Logo & Favicon Guide

## 📍 Logo Location

The logo is now centralized in `components/logo.tsx`. This component is used throughout the site.

### How to Change the Logo

#### Option 1: Change the Emoji
1. Open `components/logo.tsx`
2. Find line 23: `✉️`
3. Replace with your desired emoji (e.g., `🚀`, `💌`, `📧`)

#### Option 2: Use a Custom Image/SVG

1. **Add your logo file** to the `public` folder:
   - `public/logo.png` (PNG format)
   - OR `public/logo.svg` (SVG format - recommended for best quality)

2. **Edit `components/logo.tsx`**:
   - Comment out lines 22-24 (the emoji div)
   - Uncomment lines 26-32 (the Image component)
   - Update the `src="/logo.png"` to match your filename

Example:
```tsx
// Comment this out
{/* <div className={...}>
  ✉️
</div> */}

// Uncomment and use this
<Image 
  src="/logo.png"  // or "/logo.svg"
  alt="QuickMail Logo" 
  width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
  height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
  className="rounded-full"
/>
```

### Logo Sizes
The Logo component supports three sizes:
- `sm` - 32px (used in footer)
- `md` - 40px (used in header)
- `lg` - 48px (for special cases)

---

## 🌐 Favicon (Browser Tab Icon)

### Current Setup
Next.js 14 uses the App Router which looks for favicon files in the `app` directory.

### How to Change the Favicon

#### Method 1: Simple Favicon (Recommended)
1. **Create or get your favicon files**:
   - `favicon.ico` (16x16 and 32x32 sizes in one file)
   - You can generate one at: https://favicon.io/

2. **Place the file** in the `app` directory:
   ```
   app/
     favicon.ico  ← Put it here
     layout.tsx
     page.tsx
     ...
   ```

3. Next.js will automatically detect and use it!

#### Method 2: Multiple Sizes (Best Practice)

Create an `icon.tsx` or `icon.png` file in the `app` directory:

**Option A: Static PNG/SVG**
1. Create multiple sizes:
   - `app/icon.png` (any size, 512x512 recommended)
   - `app/apple-icon.png` (180x180 for iOS)

**Option B: Dynamic Icon (TypeScript)**
Create `app/icon.tsx`:
```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #7c3aed, #9333ea)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}
      >
        ✉️
      </div>
    ),
    {
      ...size,
    }
  )
}
```

#### Method 3: Using Metadata (Full Control)

Edit `app/layout.tsx` and add to the metadata object:

```tsx
export const metadata: Metadata = {
  title: "QuickMail - Send Emails Fast with AI",
  description: "Send emails quickly with AI-powered body generation.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}
```

---

## 📁 Recommended File Structure

```
app/
  favicon.ico          ← Main favicon
  icon.png            ← 512x512 PNG icon
  apple-icon.png      ← 180x180 iOS icon
  layout.tsx
  page.tsx

public/
  logo.png            ← Your custom logo
  logo.svg            ← SVG version (optional)
```

---

## 🚀 Quick Start

### To change logo RIGHT NOW:
1. Open `components/logo.tsx`
2. Change line 23 from `✉️` to your preferred emoji
3. Refresh your browser

### To change favicon RIGHT NOW:
1. Get a favicon.ico file (or create one at https://favicon.io/)
2. Place it in the `app` folder
3. Restart your dev server: `pnpm dev`
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## 💡 Pro Tips

1. **Logo Image Format**: Use SVG for logos when possible (scales perfectly at all sizes)
2. **Favicon Sizes**: Create a 32x32 and 16x16 favicon.ico file
3. **Cache Issues**: If favicon doesn't update, clear browser cache or use incognito mode
4. **iOS Icons**: Apple devices prefer 180x180 PNG files named `apple-icon.png`
5. **Testing**: Test your favicon at different sizes using browser dev tools

---

## 🔗 Helpful Tools

- **Favicon Generator**: https://favicon.io/
- **Logo Maker**: https://www.canva.com/
- **Icon Converter**: https://cloudconvert.com/
- **Emoji Picker**: https://emojipedia.org/

---

## ✅ Verification Checklist

After changing your logo/favicon:
- [ ] Logo appears in header on all pages
- [ ] Logo appears in footer
- [ ] Favicon shows in browser tab
- [ ] Favicon shows when bookmarked
- [ ] Logo looks good in both light and dark mode
- [ ] Images are optimized (compressed)
