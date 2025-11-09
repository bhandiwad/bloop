# 📱 iOS App Build Guide for Bloop

Complete guide to build your web app as a native iOS app using Capacitor.

---

## ⚡ Quick Start

### **Option A: Recommended Setup**

```bash
# 1. Initialize Capacitor (already installed)
npx cap init Bloop com.bloop.app --web-dir=dist/public

# 2. Add iOS platform
npx cap add ios

# 3. Build your web app
npm run build

# 4. Sync web assets to iOS
npx cap sync ios

# 5. Open in Xcode
npx cap open ios
```

---

## 🔧 Detailed Setup Steps

### **1. Capacitor Configuration**

After running `npx cap init`, you'll have a `capacitor.config.ts` file. Update it:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bloop.app', // Change to your bundle ID
  appName: 'Bloop',
  webDir: 'dist/public',  // Must match your Vite build output
  server: {
    // For development - allows connecting to local server
    androidScheme: 'https',
    iosScheme: 'https',
    
    // IMPORTANT: For local development/testing
    // hostname: 'localhost',
    // cleartext: true,
  },
  plugins: {
    // Optional: Configure native plugins
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
    },
  },
};

export default config;
```

---

### **2. Update Package.json Scripts**

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "ios:dev": "npm run build && npx cap sync ios && npx cap open ios",
    "ios:sync": "npm run build && npx cap sync ios",
    "ios:open": "npx cap open ios"
  }
}
```

---

### **3. Critical: Handle Backend Connection**

Your app uses WebSocket and API calls. For iOS, you need to handle:

#### **Option A: Deploy Backend to Cloud** (Recommended)
- Deploy server to **Railway**, **Render**, or **Fly.io**
- Use production API URL in the app
- Example: `https://bloop-api.railway.app`

#### **Option B: Local Development**
For testing with local server on your Mac:

1. Find your Mac's local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.100
   ```

2. Update WebSocket connection in your app to use local IP:
   ```typescript
   // In production, use deployed server
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://your-api.com'
     : 'http://192.168.1.100:5001';
   ```

---

### **4. Environment Variables**

Create `client/.env.production`:

```env
VITE_API_URL=https://your-production-api.com
VITE_WS_URL=wss://your-production-api.com/ws
```

Update your WebSocket connection to use env vars:

```typescript
// client/src/hooks/useGameSocket.ts
const wsUrl = import.meta.env.VITE_WS_URL || 
  (import.meta.env.DEV 
    ? `ws://${window.location.host}/ws`
    : `wss://${window.location.host}/ws`);
```

---

### **5. Build & Test**

```bash
# Build web app
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode (requires macOS)
npx cap open ios
```

In Xcode:
1. Select your team (Apple Developer Account)
2. Choose a real device or simulator
3. Click ▶️ Run

---

## 📦 Native Features (Optional)

Add native capabilities as needed:

### **Status Bar**
```bash
npm install @capacitor/status-bar

# Then in your app:
import { StatusBar, Style } from '@capacitor/status-bar';
await StatusBar.setStyle({ style: Style.Dark });
```

### **Haptic Feedback**
```bash
npm install @capacitor/haptics

# Usage:
import { Haptics, ImpactStyle } from '@capacitor/haptics';
await Haptics.impact({ style: ImpactStyle.Medium });
```

### **Share API**
```bash
npm install @capacitor/share

# Usage:
import { Share } from '@capacitor/share';
await Share.share({
  title: 'Join my Bloop game!',
  text: 'Room code: ABC123',
  url: 'https://bloop.app/join/ABC123',
});
```

### **Push Notifications**
```bash
npm install @capacitor/push-notifications
# Requires Apple Developer Program ($99/year)
```

---

## 🚀 Deployment Requirements

### **For TestFlight (Beta Testing)**
1. **Apple Developer Account** ($99/year)
2. **App Icons** (1024x1024 and various sizes)
3. **Screenshots** (Various iPhone sizes)
4. **Privacy Policy URL**
5. **Support URL**

### **For App Store**
All TestFlight requirements, plus:
- App Review Guidelines compliance
- Age Rating
- App Description & Keywords
- App Preview Video (optional but recommended)

---

## 🎨 iOS-Specific Optimizations

### **1. Safe Area Handling**

iOS has notches/home indicators. Update your CSS:

```css
/* Add to your global styles */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### **2. Splash Screen**

Create `ios/App/App/Assets.xcassets/Splash.imageset/`:
- splash-2732x2732.png (iPad Pro)
- splash-2732x2732-1.png
- splash-2732x2732-2.png

### **3. App Icon**

Required sizes (in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`):
- 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024

Use [App Icon Generator](https://www.appicon.co/) to generate all sizes.

---

## 🔍 Debugging

### **View Console Logs**

In Xcode:
1. Run app on device/simulator
2. Open **Debug Navigator** (⌘+7)
3. View console output

Or use Safari Web Inspector:
1. Safari → Develop → [Your Device] → [Your App]
2. Full web debugging like desktop

### **Common Issues**

#### **WebSocket Connection Fails**
- Check `Info.plist` allows HTTP connections (if using local server)
- Verify server URL is accessible from device
- Use real device on same WiFi as server

#### **Build Fails**
- Update CocoaPods: `cd ios/App && pod install`
- Clean build: Xcode → Product → Clean Build Folder
- Update Xcode to latest version

#### **White Screen**
- Check `webDir` in `capacitor.config.ts` matches build output
- Run `npx cap sync ios` after building
- Check browser console in Safari inspector

---

## 📱 Production Checklist

Before submitting to App Store:

- [ ] Backend deployed to production server
- [ ] Environment variables set correctly
- [ ] App icons generated (all sizes)
- [ ] Splash screen created
- [ ] Privacy policy published
- [ ] App tested on real devices
- [ ] WebSocket works on cellular data
- [ ] Offline error handling
- [ ] Deep linking configured (optional)
- [ ] App Store screenshots prepared
- [ ] App description written
- [ ] Keywords researched
- [ ] Apple Developer account active

---

## 🌐 Backend Deployment Options

### **Option 1: Railway** (Easiest)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up

# Configure:
# - Add PostgreSQL plugin
# - Add Redis plugin  
# - Set environment variables
# - Get production URL
```

### **Option 2: Render**
1. Connect GitHub repo
2. Create Web Service
3. Add PostgreSQL database
4. Add Redis instance
5. Set environment variables

### **Option 3: Fly.io**
```bash
fly launch
fly deploy
```

---

## 💡 Pro Tips

### **1. Use Environment Detection**
```typescript
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'

if (isNative) {
  // Use native features
}
```

### **2. Handle Network Changes**
```typescript
import { Network } from '@capacitor/network';

Network.addListener('networkStatusChange', status => {
  if (!status.connected) {
    // Show offline message
  }
});
```

### **3. Prevent Text Selection (More Native Feel)**
```css
* {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

input, textarea {
  -webkit-user-select: auto;
  user-select: auto;
}
```

### **4. iOS-Style Animations**
```typescript
// Add to your motion configs for iOS feel
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};
```

---

## 🎯 Next Steps

1. **Complete Capacitor init** (answer the prompts or use flags)
2. **Add iOS platform**: `npx cap add ios`
3. **Deploy backend** to production (Railway recommended)
4. **Update API URLs** in your code
5. **Build & sync**: `npm run build && npx cap sync ios`
6. **Open in Xcode**: `npx cap open ios`
7. **Test on device**
8. **Generate icons & splash screens**
9. **Submit to TestFlight**
10. **Gather feedback & iterate**

---

## 📚 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [TestFlight Guide](https://developer.apple.com/testflight/)

---

## 🆘 Need Help?

Common questions:

**Q: Do I need a Mac?**  
A: Yes, for iOS development you need macOS and Xcode.

**Q: Can I test on my iPhone without paying $99?**  
A: Yes! You can sideload with a free Apple ID, but only for 7 days at a time.

**Q: What about Android?**  
A: Same process! Just run `npx cap add android` instead.

**Q: Will WebSockets work?**  
A: Yes! Capacitor fully supports WebSockets.

**Q: Can I use React Native instead?**  
A: You could, but it would require rewriting your entire app. Capacitor wraps your existing web app.

---

Good luck! 🚀
