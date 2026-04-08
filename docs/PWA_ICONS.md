# PWA Icon Generation Guide

## Required Icons

To complete the PWA setup, you need to create the following icon files:

### Required Sizes:
- `icon-192.png` - 192x192px (Android, Chrome)
- `icon-512.png` - 512x512px (Android, Chrome, splash screen)
- `apple-touch-icon.png` - 180x180px (iOS home screen)

## How to Generate Icons

### Option 1: Using Design Tools
1. Create your logo/icon in a design tool (Figma, Sketch, Adobe XD)
2. Export at the required sizes (192x192, 512x512, 180x180)
3. Save as PNG with transparency (if applicable)
4. Place files in the `/public` directory

### Option 2: Using Online Tools
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **PWA Asset Generator**: https://github.com/elegantapp/pwa-asset-generator
- **Favicon.io**: https://favicon.io/

### Option 3: Using CLI Tool (pwa-asset-generator)
```bash
# Install globally
npm install -g pwa-asset-generator

# Generate icons from source image
pwa-asset-generator logo.svg ./public --icon-only --path-override "/" --favicon --type png

# Generate with specific sizes
pwa-asset-generator logo.svg ./public --icon-only --icon-size 192 512 180
```

## Design Recommendations

### KSO Chandigarh Brand Guidelines
- **Primary Color**: Teal (#0ea5a6)
- **Secondary Color**: Gold (#f6c453)
- **Background**: Dark slate (#030712)

### Icon Design Tips:
1. **Keep it simple**: Icons should be recognizable at small sizes
2. **Use brand colors**: Incorporate teal and gold accents
3. **Safe area**: Keep important elements within 80% of the icon area
4. **Test on dark/light backgrounds**: Ensure visibility
5. **Avoid text**: Icons are too small for readable text
6. **Use transparent background**: Or solid brand color

## Example Icon Concepts

### Concept 1: Monogram
- Large "KSO" letters in teal on dark background
- Gold accent border or element

### Concept 2: Cultural Symbol
- Kuki cultural symbol or pattern
- Teal and gold color scheme

### Concept 3: Modern Abstract
- Abstract representation of community/education
- Geometric shapes in brand colors

## Temporary Placeholder

Until proper icons are created, you can use a solid color placeholder:

```bash
# Create solid color placeholders (requires ImageMagick)
convert -size 192x192 xc:"#0ea5a6" public/icon-192.png
convert -size 512x512 xc:"#0ea5a6" public/icon-512.png
convert -size 180x180 xc:"#0ea5a6" public/apple-touch-icon.png
```

## Testing Icons

After creating icons:
1. Test on Android device (Add to Home Screen)
2. Test on iOS device (Add to Home Screen)
3. Check in Chrome DevTools > Application > Manifest
4. Verify all sizes load correctly in network tab

## Next Steps

1. Create source logo/icon design
2. Generate all required sizes
3. Replace placeholder files in `/public`
4. Test PWA installation on mobile devices
5. Update manifest.json if icon paths change
