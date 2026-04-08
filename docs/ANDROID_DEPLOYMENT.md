# Android APK Deployment Guide

This guide covers the steps to convert the KSO Chandigarh Portal web app into an Android APK.

## Current Status

✅ **Completed:**
- PWA manifest.json configured
- Viewport and mobile meta tags added
- Responsive design with Tailwind CSS
- Mobile-optimized layouts and navigation

❌ **Not Yet Implemented:**
- Service Worker for offline functionality
- PWA icon assets
- Native Android wrapper

## Deployment Options

### Option 1: Progressive Web App (PWA) - Recommended for Quick Start

**Pros:**
- No app store submission required
- Instant updates without app store approval
- Smaller download size
- Cross-platform (works on iOS too)
- Easier maintenance

**Cons:**
- Limited native features
- Requires browser for initial install
- Not discoverable in Play Store

**Steps:**
1. Install next-pwa package
2. Configure service worker
3. Create PWA icons (see docs/PWA_ICONS.md)
4. Test "Add to Home Screen" functionality
5. Deploy to production

**Implementation:**
```bash
npm install next-pwa
```

Create `next.config.ts`:
```typescript
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})({
  // existing config
});

export default nextConfig;
```

---

### Option 2: Capacitor (Native Wrapper) - Recommended for Play Store

**Pros:**
- Full native feature access (camera, push notifications, etc.)
- Distributable via Google Play Store
- Better offline capabilities
- Native app feel

**Cons:**
- More complex setup and maintenance
- Requires separate build process
- Larger app size
- Needs Play Store developer account ($25 one-time)

**Steps:**

#### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init "KSO Chandigarh Portal" org.ksochd.portal
```

#### 2. Configure Capacitor
Edit `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.ksochd.portal',
  appName: 'KSO Portal',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'android/keystore.jks',
      keystoreAlias: 'ksochd',
    }
  }
};

export default config;
```

#### 3. Update package.json scripts
```json
{
  "scripts": {
    "build:android": "next build && npx cap sync android && npx cap open android"
  }
}
```

#### 4. Build and Add Android Platform
```bash
# Build Next.js app
npm run build

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync android

# Open in Android Studio
npx cap open android
```

#### 5. Configure Android Manifest
Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest>
  <application
    android:label="KSO Portal"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:theme="@style/AppTheme">

    <!-- Add permissions as needed -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  </application>
</manifest>
```

#### 6. Generate Signing Key
```bash
# Create keystore for release builds
keytool -genkey -v -keystore android/keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ksochd

# Keep keystore password and alias password secure!
```

#### 7. Build Release APK
```bash
# In Android Studio:
# Build > Generate Signed Bundle/APK > APK
# Select keystore, enter passwords, choose release variant

# Or via command line:
cd android
./gradlew assembleRelease

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

---

### Option 3: Trusted Web Activity (TWA) - Middle Ground

**Pros:**
- Simpler than Capacitor
- Distributable via Play Store
- Uses Chrome Custom Tabs (smaller app size)
- Easier to maintain

**Cons:**
- Requires PWA to be deployed first
- Limited native features
- Depends on Chrome browser

**Steps:**
1. Deploy PWA to production
2. Use Bubblewrap CLI to generate Android project
3. Customize app details and icons
4. Build and sign APK
5. Submit to Play Store

**Implementation:**
```bash
# Install Bubblewrap
npm install -g @bubblewrap/cli

# Initialize project
bubblewrap init --manifest https://yourdomain.com/manifest.json

# Build APK
bubblewrap build

# APK will be at: ./app-release-signed.apk
```

---

## Prerequisites for All Options

### 1. Production Deployment
- Deploy web app to production URL (Vercel, Netlify, etc.)
- Ensure HTTPS is enabled
- Test all functionality on production

### 2. Icon Assets
- Create all required icon sizes (see docs/PWA_ICONS.md)
- Generate adaptive icons for Android
- Test icons on various devices

### 3. Google Play Console Account
For Play Store distribution:
- Create Google Play Developer account ($25 one-time fee)
- Set up app listing with screenshots, description, etc.
- Comply with Google Play policies

### 4. Testing Devices
- Test on real Android devices (various screen sizes)
- Test on different Android versions (minimum: Android 8.0)
- Verify offline functionality (if applicable)

---

## Recommended Approach

**Phase 1: PWA (Week 1)**
1. ✅ Add manifest.json and meta tags (DONE)
2. Install and configure next-pwa
3. Create PWA icons
4. Test "Add to Home Screen" on Android
5. Deploy to production

**Phase 2: Enhanced PWA (Week 2-3)**
1. Implement offline functionality with service worker
2. Add push notifications (optional)
3. Optimize for mobile performance
4. Add analytics for mobile usage

**Phase 3: Native App (Week 4+)**
1. Evaluate need for native features
2. If needed, implement Capacitor wrapper
3. Set up Android development environment
4. Build and test APK locally
5. Submit to Google Play Store

---

## Testing Checklist

- [ ] Test on Android 8.0+ devices
- [ ] Test on different screen sizes (phone, tablet)
- [ ] Test portrait and landscape orientations
- [ ] Test slow network conditions
- [ ] Test offline functionality (if PWA)
- [ ] Test "Add to Home Screen" flow
- [ ] Verify all navigation works correctly
- [ ] Test forms and user inputs
- [ ] Verify authentication flow
- [ ] Test payment integration (Razorpay)
- [ ] Check performance (Lighthouse score)

---

## Resources

### Documentation
- [Next.js PWA Plugin](https://github.com/shadowwalker/next-pwa)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/)
- [Google Play Console](https://play.google.com/console)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA audit
- [Android Studio](https://developer.android.com/studio) - Android development
- [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) - TWA generator

---

## Support

For issues or questions:
1. Check existing documentation
2. Test on multiple devices
3. Review Chrome DevTools console for errors
4. Consult Capacitor/PWA community forums
