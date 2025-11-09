# 🔧 WebSocket Connection Fix

## Problem
WebSocket was trying to connect to `ws://localhost:undefined/` causing connection failures.

## Root Cause
The client was using `window.location.host` which doesn't include the port when running through Vite dev server. The Vite dev server runs on a different port than the Express backend.

## Solution
Added Vite proxy configuration to forward WebSocket and API requests to the Express server.

### Changes Made

#### 1. Updated `vite.config.ts`
Added proxy configuration:
```typescript
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5001",
      changeOrigin: true,
    },
    "/ws": {
      target: "ws://localhost:5001",
      ws: true,
    },
  },
}
```

#### 2. Updated `client/src/hooks/useGameSocket.ts`
Simplified WebSocket URL to use the proxy:
```typescript
const wsUrl = `${protocol}//${window.location.host}/ws`;
```

## How It Works

### Development Mode
```
Browser → Vite Dev Server (port varies)
          ↓ (proxy)
          Express Server (port 5001)
          ↓
          WebSocket /ws
```

### Production Mode
```
Browser → Express Server (same port)
          ↓
          WebSocket /ws
```

## Next Steps

**You need to restart the dev server for the proxy to work:**

1. Stop the current dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Refresh the browser

The WebSocket connection should now work correctly!

## Files Modified
- `vite.config.ts` - Added proxy configuration
- `client/src/hooks/useGameSocket.ts` - Simplified WebSocket URL

## Verification
After restarting, you should see:
- ✅ No WebSocket errors in console
- ✅ "Connecting to server..." message disappears quickly
- ✅ Game functions normally
