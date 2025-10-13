# MerkeWin - Intelligent Business Consultation Platform

## Error Resolution Guide

### Common Browser Extension Errors

#### "Unchecked runtime.lastError: The page keeping the extension port is moved into back/forward cache"

This error is typically caused by browser extensions (like React DevTools, Redux DevTools, or other development extensions) trying to communicate with a page that has been moved to the browser's back/forward cache.

**Solutions:**
1. **Disable problematic extensions**: Temporarily disable development extensions to identify the culprit
2. **Use Incognito Mode**: Test the application in incognito mode where extensions are typically disabled
3. **Clear Browser Cache**: Clear your browser's cache and hard refresh (Ctrl+Shift+R)
4. **Update Extensions**: Ensure all browser extensions are up to date

**This error does not affect the application functionality** - it's purely a browser extension communication issue.

### Recently Fixed Errors

#### ✅ "Sparkles is not defined" - RESOLVED
**Cause:** `Sparkles` icon was used in LandingPage.tsx but not imported from lucide-react
**Solution:** Added `Sparkles` to the import statement
```tsx
import { Sparkles, /* other icons */ } from 'lucide-react';
```

#### ✅ "Briefcase is not defined" - RESOLVED  
**Cause:** `Briefcase` icon was removed from imports but still referenced in dashboard menu
**Solution:** Replaced with `FolderOpen` icon for better UX

#### ✅ Duplicate case clause warning - RESOLVED
**Cause:** `case 'mature':` appeared twice in switch statement
**Solution:** Removed duplicate case clause

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Logo Implementation

The application now uses custom logos located in:
- `public/logo.png` - Main logo for components
- `public/favicon.png` - PNG favicon
- `public/favicon.ico` - ICO favicon
- `public/apple-touch-icon.png` - Apple device icon

### Technologies Used

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Supabase for backend services

## Troubleshooting

If you encounter build errors:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `npm run build --force`
3. Check for TypeScript errors: `npm run type-check`
4. Check for missing imports: Look for `ReferenceError: [IconName] is not defined` errors