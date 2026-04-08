# Mobile & Responsive Testing Guide

## Testing Checklist

### 1. Viewport & Meta Tags
- [x] Viewport meta tag configured
- [x] Theme color meta tags added
- [x] Apple web app meta tags added
- [x] OpenGraph and Twitter cards configured
- [ ] Test viewport rendering on multiple devices

### 2. Screen Sizes to Test

#### Mobile Devices
- [ ] iPhone SE (375x667) - Small phone
- [ ] iPhone 12/13/14 (390x844) - Standard phone
- [ ] iPhone 14 Pro Max (430x932) - Large phone
- [ ] Samsung Galaxy S21 (360x800) - Android standard
- [ ] Google Pixel 5 (393x851) - Android modern

#### Tablets
- [ ] iPad Mini (768x1024) - Small tablet
- [ ] iPad Air (820x1180) - Standard tablet
- [ ] iPad Pro 11" (834x1194) - Large tablet
- [ ] Samsung Galaxy Tab (800x1280) - Android tablet

#### Desktop
- [ ] 1024x768 - Minimum desktop
- [ ] 1366x768 - Common laptop
- [ ] 1920x1080 - Full HD
- [ ] 2560x1440 - QHD
- [ ] 3840x2160 - 4K

### 3. Orientation Testing
- [ ] Portrait mode (all pages)
- [ ] Landscape mode (all pages)
- [ ] Rotation transitions smooth
- [ ] Content reflows correctly

### 4. Touch Interactions
- [ ] All buttons are at least 44x44px (Apple guideline)
- [ ] Touch targets have adequate spacing (8px minimum)
- [ ] No accidental clicks from nearby elements
- [ ] Swipe gestures work (if applicable)
- [ ] Long press doesn't trigger unwanted actions
- [ ] Pull-to-refresh disabled where appropriate

### 5. Navigation Testing

#### Mobile Navigation
- [ ] Hamburger menu opens/closes smoothly
- [ ] Sidebar slides in from left
- [ ] Backdrop overlay visible and tappable
- [ ] Close button accessible
- [ ] Navigation links tap correctly
- [ ] Active states visible
- [ ] Menu closes after navigation

#### Tablet Navigation
- [ ] Navigation adapts to medium screens
- [ ] Both mobile and desktop modes tested
- [ ] Breakpoint transitions smooth

#### Desktop Navigation
- [ ] Full navigation always visible
- [ ] No mobile hamburger on desktop
- [ ] Hover states work correctly

### 6. Component Testing

#### Tables (Admin Pages)
- [ ] Horizontal scroll on mobile
- [ ] Scroll indicators visible
- [ ] Headers sticky (if applicable)
- [ ] Actions accessible
- [ ] Row selection works
- [ ] Filters accessible

#### Forms
- [ ] Input fields large enough to tap
- [ ] Keyboard appears correctly
- [ ] Autocomplete works
- [ ] Validation messages visible
- [ ] Submit buttons accessible
- [ ] Focus states clear

#### Cards & Panels
- [ ] Glass panels render correctly
- [ ] Backdrop blur works on mobile
- [ ] Cards stack vertically on mobile
- [ ] Grid layouts adapt to screen size

#### Modals & Dialogs
- [ ] Centered on screen
- [ ] Scrollable content
- [ ] Close button accessible
- [ ] Backdrop dismissible
- [ ] Keyboard navigation works

### 7. Typography & Readability
- [ ] Font sizes readable on mobile (minimum 16px for body)
- [ ] Line height comfortable (1.5-1.7)
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Text doesn't overflow containers
- [ ] Long words/URLs break correctly

### 8. Performance Testing

#### Mobile Performance
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 5s
- [ ] No layout shifts (CLS < 0.1)
- [ ] Images optimized
- [ ] Fonts load without FOIT

#### Network Conditions
- [ ] Test on 4G
- [ ] Test on 3G
- [ ] Test on slow 3G
- [ ] Test offline (if PWA)
- [ ] Handle connection loss gracefully

### 9. Browser Testing

#### Mobile Browsers
- [ ] Safari iOS (14+)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet
- [ ] Firefox Android
- [ ] Edge Mobile

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### 10. Accessibility (Mobile)
- [ ] Screen reader compatible (VoiceOver, TalkBack)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Touch targets adequate size
- [ ] Text zoomable to 200%

### 11. PWA Features (When Implemented)
- [ ] "Add to Home Screen" prompt appears
- [ ] Icon displays correctly on home screen
- [ ] Splash screen shows on launch
- [ ] App opens in standalone mode
- [ ] Service worker caches assets
- [ ] Offline functionality works
- [ ] Push notifications (if enabled)

### 12. Specific Page Testing

#### Public Home Page (/)
- [ ] Hero section readable on mobile
- [ ] Pills wrap correctly
- [ ] Cards stack vertically
- [ ] CTAs accessible
- [ ] Links tappable

#### Member Dashboard (/dashboard)
- [ ] User profile displays correctly
- [ ] Stats cards stack on mobile
- [ ] Quick actions accessible
- [ ] Event cards scrollable

#### Admin Dashboard (/admin)
- [ ] Sidebar toggles on mobile
- [ ] Stats grid responsive
- [ ] Charts resize correctly
- [ ] Tables scroll horizontally

#### Events (/events)
- [ ] Event cards stack on mobile
- [ ] Filters accessible
- [ ] Registration buttons visible
- [ ] Date/time readable

#### Payments (/payments)
- [ ] Payment form usable on mobile
- [ ] Amount input large enough
- [ ] Payment method selection clear
- [ ] Razorpay integration works

#### Profile (/profile)
- [ ] Form inputs accessible
- [ ] Upload buttons tappable
- [ ] Save button visible
- [ ] Validation clear

## Testing Tools

### Chrome DevTools
```
1. Open DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Select device preset or custom size
4. Toggle device orientation
5. Throttle network (Fast 3G, Slow 3G)
6. Check mobile/desktop user agent
```

### Lighthouse Audit
```
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Mobile" device
4. Check all categories
5. Run audit
6. Address issues with score < 90
```

### Browser Stack (Remote Testing)
- Test on real devices
- Multiple OS versions
- Various browsers
- Network conditions

### Physical Device Testing
1. Connect via USB debugging (Android)
2. Use Safari Developer Tools (iOS)
3. Test on real network conditions
4. Verify touch interactions
5. Check performance on older devices

## Common Issues & Fixes

### Issue: Text too small on mobile
**Fix:** Ensure base font size is at least 16px

### Issue: Touch targets too small
**Fix:** Add minimum height/width of 44px, increase padding

### Issue: Horizontal scroll on mobile
**Fix:** Check for fixed widths, use max-width: 100%, overflow-x: hidden

### Issue: Images too large
**Fix:** Use responsive images with max-width: 100%, height: auto

### Issue: Navbar doesn't close after click
**Fix:** Add onClick handler to close sidebar on navigation

### Issue: Input fields cause horizontal scroll
**Fix:** Use width: 100% instead of fixed widths

### Issue: Poor performance on mobile
**Fix:** Optimize images, reduce JS bundle, lazy load components

### Issue: Touch events not working
**Fix:** Use onClick instead of onHover, ensure pointer-events: auto

## Automated Testing

### Responsive Testing Script
```javascript
// Add to package.json scripts
"test:mobile": "lighthouse https://localhost:3000 --view --preset=perf --emulated-form-factor=mobile"
```

### Visual Regression Testing
```bash
# Using Percy or similar tool
npm install --save-dev @percy/cli @percy/playwright
```

## Documentation & Reporting

After testing, document:
1. Devices tested
2. Issues found
3. Screenshots of issues
4. Priority of fixes
5. Recommendations

## Next Steps

1. Complete all checklist items
2. Fix identified issues
3. Re-test on real devices
4. Get user feedback
5. Iterate based on feedback
