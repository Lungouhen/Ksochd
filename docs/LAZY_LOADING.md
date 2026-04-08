# Lazy Loading Strategy

This document outlines the lazy loading implementation for the KSO Chandigarh Portal.

## Implementation

### 1. Components with Dynamic Imports

Use Next.js `dynamic` imports for heavy components that are not immediately visible:

```typescript
import dynamic from 'next/dynamic';

// Lazy load charts and visualizations
const VisitorsChart = dynamic(() => import('@/components/admin/VisitorsChart'), {
  loading: () => <div className="animate-pulse bg-slate-800 h-64 rounded-lg" />,
  ssr: false, // Disable SSR for client-only components
});

// Lazy load modals and dialogs
const NotificationBell = dynamic(() => import('@/components/notifications/NotificationBell'), {
  loading: () => <div className="h-8 w-8 bg-slate-800 rounded-full animate-pulse" />,
});
```

### 2. Images with next/image

All images use the Next.js Image component with automatic lazy loading:

```typescript
import Image from 'next/image';

<Image
  src="/event-poster.jpg"
  alt="Event poster"
  width={800}
  height={600}
  loading="lazy" // Explicit lazy loading
  placeholder="blur" // Show blur placeholder while loading
  blurDataURL="data:image/..." // Low-quality placeholder
/>
```

### 3. Route-based Code Splitting

Next.js automatically code-splits by route. Each page bundle is loaded on demand:

- `/dashboard` → dashboard chunk
- `/events` → events chunk
- `/admin` → admin chunk

### 4. Component-level Splitting

Heavy dependencies are dynamically imported:

```typescript
// Charts (recharts is ~100KB)
const Chart = dynamic(() => import('recharts').then(mod => mod.LineChart));

// Rich text editors
const Editor = dynamic(() => import('@/components/cms/Editor'), { ssr: false });

// PDF viewers
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), { ssr: false });
```

## Components to Lazy Load

### High Priority (Immediate Implementation)
- [x] VisitorsChart (recharts dependency)
- [ ] NotificationBell (polling component)
- [ ] RichTextEditor (CMS pages)
- [ ] PDFViewer (document viewing)
- [ ] ImageGallery (media library)

### Medium Priority
- [ ] Analytics dashboards
- [ ] Payment forms (Razorpay integration)
- [ ] Advanced filters
- [ ] Export functionality

### Low Priority
- [ ] Profile image upload
- [ ] Theme previews
- [ ] Settings panels

## Image Optimization

### Current Implementation
- ✅ next/image configured in next.config.ts
- ✅ AVIF and WebP format support
- ✅ Responsive image sizes
- ✅ SVG support with CSP

### Image Guidelines

1. **Use next/image for all images**
   ```tsx
   import Image from 'next/image';

   <Image
     src="/logo.png"
     alt="KSO Logo"
     width={200}
     height={100}
     priority // For above-the-fold images
   />
   ```

2. **Priority loading for above-the-fold images**
   - Logo
   - Hero images
   - Featured content

3. **Lazy loading for below-the-fold images**
   - Gallery images
   - Event posters
   - User avatars (in lists)

4. **Placeholder strategies**
   - Use `placeholder="blur"` for local images
   - Use `placeholder="empty"` for external images
   - Generate blurDataURL for better UX

## Performance Targets

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Total Blocking Time (TBT): < 200ms
- Cumulative Layout Shift (CLS): < 0.1

## Monitoring

Use Lighthouse and Web Vitals to monitor:

```bash
# Run Lighthouse audit
npm run lighthouse

# Check bundle sizes
npm run build
```

## Best Practices

1. **Avoid importing heavy libraries at the top level**
   ```typescript
   // ❌ Bad
   import recharts from 'recharts';

   // ✅ Good
   const Chart = dynamic(() => import('recharts').then(mod => mod.LineChart));
   ```

2. **Use loading states**
   Always provide loading UI for dynamic components

3. **Consider SSR vs CSR**
   - SSR: SEO-critical content
   - CSR: Interactive widgets, charts

4. **Optimize fonts**
   - Use local fonts (already implemented)
   - Subset fonts when possible
   - Use font-display: swap

5. **Code splitting**
   - Split by route (automatic)
   - Split heavy components (manual)
   - Split vendor bundles (webpack config)

## Testing

Test lazy loading behavior:

```bash
# Slow 3G throttling
npm run dev -- --throttle

# Lighthouse CI
npx lighthouse-ci autorun
```

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Web Vitals](https://web.dev/vitals/)
