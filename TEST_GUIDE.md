# Testing Guide - Bloop Improvements

## 🎮 How to Test

Server is running on **http://localhost:5001**

## Test Scenarios

### 1. ✅ Simpler Room Codes (4 chars)
**Steps:**
1. Open home page
2. Click "Create Room"
3. Enter name, select deck
4. Create room → Note the 4-character code (e.g., `AB3K`)
5. Open new tab, click "Join Room"
6. Enter the 4-char code → Should join successfully

**Expected:**
- Code is 4 characters only
- Join input is large with wide spacing
- Placeholder shows "A B 3 K"

---

### 2. ✅ Ready Screen Before Rounds
**Steps:**
1. Create room with 2+ players
2. Host clicks "Start Game"
3. Should see "Are you ready?" screen
4. All players click "I'm Ready!"
5. Round auto-starts when everyone is ready

**Expected:**
- Shows round number prominently
- Grid of player avatars with checkmarks
- "X of Y players ready" counter
- Big blue "I'm Ready!" button
- Button disabled after clicking

---

### 3. ✅ Bloop'd Celebration Messages
**Steps:**
1. Play a round
2. Submit a fake answer that fools other players
3. Wait for reveal phase
4. Should see full-screen "BLOOP'D [Name] GOT YOU!" message

**Expected:**
- Bold colorful overlay
- Shows names of fooled players
- Confetti + sound effect
- Auto-dismisses after 4 seconds
- Can see game content behind it

---

### 4. ✅ End Game Notifications
**Steps:**
1. Play game to final round
2. Host clicks "End Game" from leaderboard
3. All players should see end game screen

**Expected:**
- Trophy + crown for winner
- Final leaderboard with rankings
- "[Winner] wins!" message
- "Return to Home" button
- Clicking returns to home page

---

### 5. ✅ Default No-Timer Mode
**Steps:**
1. Create room (don't change settings)
2. Start game
3. During collect/vote phases, no timer should show

**Expected:**
- No countdown timer visible
- Players control pace by submitting
- Round advances when all submit
- Host can enable timers in settings if desired

---

### 6. ✅ Better Question Content
**Steps:**
1. Create room
2. Select "Psych Words" or "Psych Facts" deck
3. Play a round

**Expected:**
- Questions like "What does 'bumfuzzle' mean?"
- Answers are descriptive phrases (not single words)
- Examples:
  - "to confuse or perplex someone"
  - "they can taste with their arms"
  - "about 60 percent"

---

## 🐛 Known Issues to Watch For

1. **Timer showing when it shouldn't**
   - If `collectTime/voteTime = 0`, timer component shouldn't render
   - Currently might show "0:00" - this is cosmetic only

2. **Bloop'd message timing**
   - Should only show once per reveal phase
   - Should dismiss before moving to leaderboard

3. **Ready state sync**
   - All players must click ready
   - If someone disconnects, round might not start

---

## 🎨 Visual Checklist

### Home Page
- [ ] Room code input is large (text-4xl)
- [ ] Input has wide letter spacing
- [ ] Placeholder shows "A B 3 K"
- [ ] Only accepts 4 alphanumeric characters

### Ready Screen
- [ ] Round number is huge and prominent
- [ ] Player grid shows 2-3 columns
- [ ] Ready players have green border + checkmark
- [ ] Counter updates in real-time
- [ ] Button changes to "Ready!" after click

### Bloop'd Message
- [ ] Full-screen overlay
- [ ] Gradient background (orange/yellow/green)
- [ ] Bold white text (4xl-6xl)
- [ ] Names listed separately
- [ ] Animated entrance (scale + rotate)

### End Game Screen
- [ ] Trophy icon at top
- [ ] Winner has crown icon
- [ ] 1st place has gradient background
- [ ] Rankings numbered #1, #2, #3...
- [ ] Return button is prominent

---

## 🔧 Quick Fixes

If something isn't working:

1. **Refresh browser** - HMR might miss some changes
2. **Check console** - Look for WebSocket errors
3. **Restart server** - `npm run dev` in `/Users/pb/bloop`
4. **Clear localStorage** - Might have old player data

---

## 📊 Test Results Template

```
✅ 4-char room codes working
✅ Ready screen shows and functions
✅ Bloop'd message appears on fool
✅ End game screen displays
✅ No timers by default
✅ Psych-style questions loaded

Issues found:
- [List any bugs here]
```
