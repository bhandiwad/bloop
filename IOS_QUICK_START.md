# 📱 iOS Quick Start - Copy & Paste Commands

## 🚀 Complete Setup (5 Minutes)

### **Step 1: Initialize Capacitor**
```bash
npx cap init Bloop com.bloop.app --web-dir=dist/public
```

### **Step 2: Add iOS Platform**
```bash
npx cap add ios
```

### **Step 3: Add Helpful Scripts to package.json**

Add these to your `"scripts"` section:

```json
"ios:build": "npm run build && npx cap sync ios",
"ios:open": "npx cap open ios",
"ios:dev": "npm run build && npx cap sync ios && npx cap open ios"
```

### **Step 4: Build & Launch**
```bash
npm run ios:dev
```

This will:
1. Build your web app with Vite
2. Copy files to iOS project
3. Open Xcode

---

## 📋 Daily Development Workflow

```bash
# After making changes to web app:
npm run build          # Build web assets
npx cap sync ios       # Sync to iOS
npx cap open ios       # Open in Xcode, then press ▶️ Run

# Or use the shortcut:
npm run ios:dev
```

---

## ⚡ First-Time Xcode Setup

When Xcode opens:

1. **Select Team**
   - Click project name in left sidebar
   - Go to "Signing & Capabilities" tab
   - Select your Apple ID under "Team"

2. **Change Bundle Identifier** (if needed)
   - Same tab, change from `com.bloop.app` to your own
   - Example: `com.yourname.bloop`

3. **Select Device**
   - Top toolbar, next to "Bloop" app name
   - Choose: "Any iOS Device" or a connected iPhone

4. **Run**
   - Click ▶️ Play button
   - Wait for build (first time takes ~2 mins)
   - App launches on device/simulator

---

## 🌐 Deploy Backend First!

Your app needs a server. Quick options:

### **Option 1: Railway (Recommended)**
```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Deploy (from project root)
railway up

# Add services in Railway dashboard:
# - PostgreSQL
# - Redis
# - Set all environment variables
```

### **Option 2: Render**
1. Go to [render.com](https://render.com)
2. "New +" → "Web Service"
3. Connect GitHub
4. Select your repo
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add PostgreSQL + Redis from dashboard

### **Then Update Your App:**

Create `client/.env.production`:
```env
VITE_API_URL=https://your-app.railway.app
VITE_WS_URL=wss://your-app.railway.app/ws
```

---

## 🎨 Must-Have Assets

### **App Icon** (Required)

1. Create a 1024x1024 PNG icon
2. Use [appicon.co](https://www.appicon.co/) to generate all sizes
3. Download and replace files in:
   `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### **Splash Screen** (Optional but Nice)

1. Create 2732x2732 PNG
2. Add to `ios/App/App/Assets.xcassets/Splash.imageset/`

---

## 🔧 Capacitor Config

After init, edit `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bloop.app',
  appName: 'Bloop',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
};

export default config;
```

---

## 🐛 Troubleshooting

### **White Screen After Build**
```bash
# Rebuild and sync
npm run build
npx cap sync ios
# Then run again in Xcode
```

### **WebSocket Not Connecting**
- Check backend is deployed and accessible
- Verify WebSocket URL in code
- Test URL in browser first: `https://your-api.com/api/health`

### **"No Team Selected" Error**
- Xcode → Preferences → Accounts
- Add your Apple ID
- Select it in Signing & Capabilities

### **Build Failed in Xcode**
```bash
# Update CocoaPods
cd ios/App
pod install
cd ../..

# Clean build in Xcode
# Product → Clean Build Folder (Shift+Cmd+K)
```

---

## ✅ Pre-Launch Checklist

- [ ] Backend deployed to production
- [ ] Environment variables configured
- [ ] App icons generated (all sizes)
- [ ] Tested on real iPhone
- [ ] WebSocket works over WiFi
- [ ] WebSocket works over cellular
- [ ] Error states look good
- [ ] Privacy policy created
- [ ] Apple Developer account ($99/year)

---

## 🚀 Submit to TestFlight

1. In Xcode: Product → Archive
2. Wait for archive to complete
3. Click "Distribute App"
4. Select "App Store Connect"
5. Upload
6. Go to [App Store Connect](https://appstoreconnect.apple.com)
7. Add to TestFlight
8. Invite testers via email

---

## 📱 Testing on Your iPhone (Free)

Don't want to pay $99 yet? You can sideload:

1. Connect iPhone via USB
2. Trust computer on iPhone
3. In Xcode, select your iPhone as target
4. Click Run ▶️
5. On iPhone: Settings → General → VPN & Device Management
6. Trust your Apple ID
7. App installs for 7 days

---

## 💡 Quick Tips

```typescript
// Detect if running as native app
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  console.log('Running as iOS/Android app!');
  console.log('Platform:', Capacitor.getPlatform()); // 'ios'
}
```

```typescript
// Add haptic feedback (feels native)
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// On button click:
await Haptics.impact({ style: ImpactStyle.Light });
```

```typescript
// Share game invites
import { Share } from '@capacitor/share';

await Share.share({
  title: 'Join my Bloop game!',
  text: `Room code: ${roomCode}`,
});
```

---

## 🎯 What's Next?

1. ✅ Complete Capacitor setup (commands above)
2. ✅ Deploy your backend (Railway recommended)
3. ✅ Update API URLs in code
4. ✅ Build and test on iOS
5. ✅ Create app icons
6. ✅ Test on real device
7. ✅ Polish UX for mobile (safe areas, haptics)
8. ✅ Submit to TestFlight
9. ✅ Get feedback
10. ✅ Submit to App Store! 🎉

---

Full guide: See `IOS_BUILD_GUIDE.md` for detailed instructions.
