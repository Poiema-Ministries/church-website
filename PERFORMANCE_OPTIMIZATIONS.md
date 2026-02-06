# Performance Optimizations

This document outlines the performance optimizations implemented to improve Core Web Vitals and overall website performance.

## Issues Addressed

Based on performance metrics showing poor scores:
- **LCP (Largest Contentful Paint)**: > 4000ms (Target: < 2500ms)
- **FCP (First Contentful Paint)**: > 3000ms (Target: < 1800ms)
- **CLS (Cumulative Layout Shift)**: > 0.25 (Target: < 0.1)
- **INP (Interaction to Next Paint)**: > 500ms (Target: < 200ms)
- **FID (First Input Delay)**: > 100ms (Target: < 100ms)

## Optimizations Implemented

### 1. Font Loading Optimization
- **File**: `app/layout.tsx`
- **Changes**:
  - Added `display: 'swap'` to prevent FOIT (Flash of Invisible Text) and reduce CLS
  - Enabled `preload: true` for critical font
  - Added fallback font (`serif`) to prevent layout shift
- **Impact**: Reduces CLS and improves FCP

### 2. Next.js Configuration Enhancements
- **File**: `next.config.ts`
- **Changes**:
  - Enabled AVIF and WebP image formats for better compression
  - Configured optimal device sizes and image sizes
  - Set minimum cache TTL for images
  - Enabled compression (`compress: true`)
  - Enabled SWC minification (`swcMinify: true`)
  - Added experimental package import optimization for Sanity
  - Added cache headers for static assets (images)
  - Added DNS prefetch control headers
- **Impact**: Reduces bundle size, improves image loading, better caching

### 3. Image Optimization
- **Files**: Multiple image components across the app
- **Changes**:
  - Added explicit `quality` settings (75-85) based on importance
  - Optimized `sizes` attributes for responsive images
  - Changed non-critical images from `eager` to `lazy` loading
  - Removed unnecessary `loading='eager'` attributes
  - Added `priority` only to LCP elements (hero image)
  - Optimized gallery images with proper loading priorities
- **Impact**: Significantly improves LCP and reduces initial bundle size

### 4. Code Splitting
- **Files**: 
  - `app/page.tsx` - Dynamic import for HomeClient
  - `app/common/components/layout-wrapper.tsx` - Dynamic imports for Navbar and Footer
- **Changes**:
  - Used `next/dynamic` for large client components
  - Maintained SSR for SEO benefits
- **Impact**: Reduces initial JavaScript bundle size, improves FCP and INP

### 5. CSS Optimization
- **File**: `app/globals.css`
- **Changes**:
  - Added `font-display: swap` to body to prevent layout shift
- **Impact**: Reduces CLS during font loading

## Specific Image Optimizations

### Hero Image (LCP Element)
- Priority loading enabled
- Quality set to 85
- Proper `sizes='100vw'` attribute
- Removed unnecessary `loading='eager'` (priority handles this)

### Gallery Images
- First 2 images: `priority` and `eager` loading
- Remaining images: `lazy` loading
- Quality: 85 for priority, 75 for lazy
- Proper `sizes` attributes for responsive loading

### Team Member Images
- Lazy loading enabled
- Quality set to 80
- Proper `sizes` attributes

### Event Gallery Images
- Lazy loading enabled
- Quality set to 75
- Proper `sizes` attributes

## Expected Performance Improvements

1. **LCP**: Should improve from >4000ms to <2500ms
   - Hero image optimization
   - Proper image sizing
   - Priority loading

2. **FCP**: Should improve from >3000ms to <1800ms
   - Font loading optimization
   - Code splitting
   - Reduced initial bundle size

3. **CLS**: Should improve from >0.25 to <0.1
   - Font display swap
   - Explicit image dimensions
   - Proper aspect ratios

4. **INP**: Should improve from >500ms to <200ms
   - Code splitting reduces main thread blocking
   - Optimized image loading reduces work

5. **FID**: Should improve from >100ms to <100ms
   - Reduced JavaScript execution time
   - Code splitting

## Additional Recommendations

### Future Optimizations to Consider

1. **Image CDN**: Consider using Cloudinary or similar for automatic image optimization
2. **Service Worker**: Implement for offline support and caching
3. **Resource Hints**: Add `preconnect` and `dns-prefetch` for external domains
4. **Bundle Analysis**: Run `@next/bundle-analyzer` to identify large dependencies
5. **Font Subsetting**: Consider subsetting fonts to reduce file size
6. **Critical CSS**: Extract and inline critical CSS for above-the-fold content
7. **Third-party Scripts**: Defer non-critical third-party scripts
8. **Image Preloading**: Preload critical images using `<link rel="preload">`

### Monitoring

- Use Lighthouse CI for continuous performance monitoring
- Monitor Core Web Vitals in production using Real User Monitoring (RUM)
- Set up performance budgets in CI/CD pipeline

## Testing

After deployment, verify improvements using:
- Google PageSpeed Insights
- WebPageTest
- Chrome DevTools Lighthouse
- Next.js Analytics (if enabled)

## Notes

- All optimizations maintain SEO benefits (SSR preserved)
- No breaking changes to functionality
- All tests should continue to pass
- Visual appearance remains unchanged
