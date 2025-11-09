# Player Reconnection Feature

## ✅ Implementation Complete

Players can now rejoin games at any phase if they disconnect or refresh the page.

---

## How It Works

### **Backend Logic** (`/server/services/gameEngine.ts`)

#### Player Matching
- When a player joins with `join_room`, backend checks if a player with the **same name** exists in the room
- If found: Restore their session (ID, score, powerUp status)
- If not found: Only allow new players in "lobby" state

```typescript
const existingPlayer = room.players.find(p => p.name === playerName);

if (existingPlayer) {
  // Reconnecting - restore session
  existingPlayer.connected = true;
  return { room, playerId: existingPlayer.id };
} else if (room.state !== "lobby") {
  // New player can't join mid-game
  return null;
}
```

#### State Preservation
When reconnecting, players retain:
- ✅ Player ID (same session)
- ✅ Score
- ✅ Power-ups (swap/spy)
- ✅ Submitted answers/votes
- ✅ Host status (if applicable)

---

### **Frontend Auto-Reconnect** (`/client/src/hooks/useGameSocket.ts`)

#### Storage Keys
```typescript
localStorage:
  - bloop_room_code: Current room code
  - bloop_player_name: Player name
  - bloop_player_avatar: Avatar ID
```

#### Auto-Reconnect Flow

1. **On WebSocket Connect:**
   - Check if `bloop_room_code` exists in localStorage
   - If yes, automatically send `join_room` message
   - Backend matches player by name and restores session

2. **On Room Join:**
   - Save room code to localStorage

3. **On Leave/End Game:**
   - Clear room code from localStorage
   - Prevents unwanted auto-reconnect

#### Success Toast
- Shows "Reconnected! Welcome back to room XXXX" when successfully rejoining an active game

---

## Test Scenarios

### ✅ **Scenario 1: Browser Refresh Mid-Game**
1. Join/create a room
2. Start game
3. Refresh browser (F5)
4. ✅ Auto-reconnects, shows toast
5. ✅ Score, answers, votes preserved

### ✅ **Scenario 2: Network Disconnect**
1. Playing game
2. Lose internet connection
3. WebSocket closes
4. Internet returns
5. ✅ WebSocket reconnects (with exponential backoff)
6. ✅ Auto-sends join_room
7. ✅ Session restored

### ✅ **Scenario 3: Intentional Leave**
1. Click "Leave Room"
2. ✅ Room code cleared from localStorage
3. Refresh browser
4. ✅ No auto-reconnect

### ✅ **Scenario 4: Game Ends**
1. Game reaches "ended" state
2. ✅ Room code cleared
3. Refresh browser
4. ✅ Back to home screen

### ❌ **Scenario 5: New Player Mid-Game**
1. Game already in progress
2. New player tries to join with room code
3. ❌ Backend rejects (state !== "lobby")
4. ✅ Only existing players can rejoin

---

## Code Changes Summary

### Backend
- `/server/services/gameEngine.ts`
  - Modified `joinRoom()` to detect reconnecting players
  - Match by player name instead of creating new ID
  - Preserve score, powerUp, and other properties

### Frontend
- `/client/src/hooks/useGameSocket.ts`
  - Added auto-reconnect on WebSocket open
  - Save/clear room code in localStorage
  - Track reconnect attempts

- `/client/src/App.tsx`
  - Added reconnection success toast

---

## Logging

### Backend Logs
```
[joinRoom] Player PB reconnecting to room abc123 in state collect
[joinRoom] New player Alice joined room abc123 in lobby
[joinRoom] New player Bob attempted to join room abc123 in state vote - rejected
```

### Frontend Logs
```
[WebSocket] Attempting auto-reconnect to room ABC1 as PB
[WebSocket] Joined room ABC1, saved for auto-reconnect
[WebSocket] Left room, cleared auto-reconnect data
```

---

## Edge Cases Handled

✅ **Multiple tabs:** Each tab gets same player session (same ID)  
✅ **Name collision:** Reconnect only works if exact name match  
✅ **Room expired:** Redis TTL deletes room, rejoin fails gracefully  
✅ **Host disconnects:** Host can reconnect and retain host privileges  
✅ **Mid-answer submission:** Player rejoins, can still submit if time remains  

---

## Future Enhancements

### Nice-to-Have Features:
1. **Visual indicator** - Show disconnected players as grayed out with "reconnecting..." badge
2. **Grace period** - Give disconnected players 30 seconds to rejoin before kicking
3. **Spectator mode** - Allow new players to watch ongoing games
4. **Host transfer** - Auto-transfer host if host is disconnected too long

---

## Production Readiness

### ✅ Ready for Production
- Redis persistence ensures room state survives server restarts
- Exponential backoff prevents connection spam
- LocalStorage handles cross-session persistence
- Error handling for all edge cases

### Security Considerations
- ✅ No authentication required (casual party game)
- ✅ Player names are sufficient for session matching
- ⚠️ Players could impersonate if they know someone's exact name
- 💡 Future: Add optional password protection for rooms

---

## Testing Checklist

- [x] Refresh during lobby
- [x] Refresh during collect phase
- [x] Refresh during vote phase
- [x] Refresh during reveal phase
- [x] Refresh during leaderboard
- [x] Network disconnect & reconnect
- [x] Manual leave room
- [x] End game
- [x] New player joining mid-game (should fail)
- [x] Score preservation
- [x] Power-up preservation
- [x] Toast notification on reconnect
