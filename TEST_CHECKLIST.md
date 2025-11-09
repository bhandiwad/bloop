# 🧪 Test Checklist for Game Issues

## Issue 1: Default Timers ✅
**Status:** FIXED
- Default settings already set to 0 (timers off)
- Location: `server/services/gameEngine.ts` line 49-57

## Issue 2: Mr Bloop Not Working ⚠️
**To Test:**
1. Create a room as host
2. Click "Add Mr Bloop (AI)" button in lobby
3. Check if Mr Bloop appears in player list
4. Start game
5. Watch if Mr Bloop submits answers automatically (3-8 sec delay)
6. Watch if Mr Bloop votes automatically (3-8 sec delay)

**Debug Steps:**
- Check browser console for errors
- Check server logs for "Mr Bloop" messages
- Verify WebSocket message is sent
- Check if button exists in lobby

## Issue 3: Blooped Messages Not Showing ⚠️
**To Test:**
1. Play a game with 2+ players
2. Submit a fake answer
3. Have another player vote for your fake answer
4. Check if "You Bloop'd [PlayerName]!" message appears
5. Check if confetti fires

**Current Implementation:**
- Messages are in `client/src/pages/Game.tsx` lines 107-128
- Should show for 4 seconds
- Should play sound and fire confetti

## Issue 4: Points Not Adding ⚠️
**To Test:**
1. Play a complete round
2. Vote for correct answer → Should get +2 points
3. Have someone vote for your fake answer → Should get +1 point per person
4. Fool everyone → Should get +2 bonus points
5. Check leaderboard after round

**Scoring Logic:**
- Correct answer: +2 points
- Per person fooled: +1 point
- Fooled everyone: +2 bonus
- Timeout: -1 point

**Debug:**
- Check `server/services/scoringService.ts`
- Verify `applyResults` is called
- Check if scores update in player objects

## Issue 5: Questions Too Binary ✅
**Status:** FIXED
- Added 20 obscure movie questions (cult classics)
- Added 20 obscure word definitions
- Questions now require specific knowledge

**New Questions Include:**
- Obscure movies: Primer, Coherence, The Man from Earth, Triangle, etc.
- Obscure words: petrichor, defenestration, aglet, phosphenes, etc.

## Issue 6: Other Decks Need Better Questions ⚠️
**To Do:**
- India deck: Add more specific regional questions
- USA deck: Add more obscure state facts
- Brawl Stars: Add more specific game mechanics

---

## Quick Test Procedure

### Test 1: Basic Game Flow
1. Create room
2. Add Mr Bloop
3. Start game
4. Submit answer
5. Wait for Mr Bloop to submit
6. Vote
7. Wait for Mr Bloop to vote
8. Check reveal phase for:
   - Blooped messages
   - Points awarded
   - Correct scores on leaderboard

### Test 2: Scoring
1. Round 1: Vote correct → Check +2 points
2. Round 2: Get 1 person fooled → Check +1 point
3. Round 3: Fool everyone → Check +3 points (1 per person + 2 bonus)

### Test 3: Mr Bloop Behavior
1. Add Mr Bloop in lobby
2. Start game
3. Mr Bloop should auto-ready (1-2 sec)
4. Mr Bloop should submit answer (3-8 sec)
5. Mr Bloop should vote (3-8 sec)
6. Mr Bloop should earn points

---

## Known Issues to Fix

### Priority 1: Mr Bloop Not Appearing
**Hypothesis:** Button might not be visible or WebSocket message not working
**Fix:** Check Lobby component and WebSocket handler

### Priority 2: Blooped Messages
**Hypothesis:** Messages might be showing but too briefly or not triggering
**Fix:** Check roundResults timing and state

### Priority 3: Points
**Hypothesis:** Points might be calculated but not displayed
**Fix:** Check if scores are updating in UI

---

## Files to Check

### Mr Bloop:
- `server/services/mrBloopService.ts` - AI logic
- `server/routes.ts` - WebSocket handlers (lines 308-364)
- `client/src/pages/Lobby.tsx` - Add/Remove buttons (lines 118-142)
- `client/src/hooks/useGameSocket.ts` - Functions (lines 170-176)

### Scoring:
- `server/services/scoringService.ts` - Calculation logic
- `server/services/gameEngine.ts` - Apply results (line 491)
- `client/src/pages/Game.tsx` - Display scores

### Messages:
- `client/src/pages/Game.tsx` - Blooped messages (lines 107-128)
- Check if `roundResults` prop is populated
- Check if `fooledPlayers` array exists

---

## Next Steps

1. ✅ Add obscure questions - DONE
2. ⏳ Test Mr Bloop functionality
3. ⏳ Verify blooped messages show
4. ⏳ Verify points are adding correctly
5. ⏳ Add better questions to other decks
