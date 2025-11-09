# 🤖 Mr Bloop - AI Player Feature

## Overview
Mr Bloop is an AI-powered player that can join your game and play like a real human! Perfect for testing or when you need an extra player.

## Features

### ✅ Automatic Gameplay
- **Submits Answers**: Generates clever fake answers using AI (or fallbacks)
- **Votes**: Strategically votes for answers (tries to avoid correct answer)
- **Gets Ready**: Automatically clicks ready before each round
- **Human-like Timing**: Random delays (3-8 seconds) to seem natural

### ✅ Smart Answer Generation
- Uses OpenAI API when available for contextual, believable answers
- Falls back to template-based answers when AI is unavailable
- Avoids repeating existing answers
- Matches the style and length of real answers

### ✅ Strategic Voting
- 70% chance to vote for a player's fake answer
- 30% chance to accidentally vote for the correct answer (realistic!)
- Never votes for own answer
- Prefers answers from real players over AI-generated ones

## How to Use

### Adding Mr Bloop
1. Create a room (you must be the host)
2. In the lobby, click **"Add Mr Bloop (AI)"** button
3. Mr Bloop joins as a player with the wizard avatar 🪄
4. Start the game normally

### Removing Mr Bloop
1. In the lobby, click **"Remove Mr Bloop"** button
2. Mr Bloop leaves the game

### During Gameplay
- Mr Bloop appears in the player list like any other player
- Shows checkmark ✓ when he submits/votes
- Earns points and competes for the win
- Automatically ready for each round

## Technical Implementation

### Backend Components

#### `mrBloopService.ts`
Main service managing Mr Bloop's behavior:
- `createMrBloop()` - Creates the AI player
- `generateAnswer()` - Generates fake answers
- `selectAnswerToVote()` - Chooses which answer to vote for
- `getThinkingDelay()` - Random delay (3-8 seconds)
- `setReady()` - Marks Mr Bloop as ready

#### `gameEngine.ts` Integration
- `scheduleMrBloopAnswer()` - Auto-submits answers after delay
- `scheduleMrBloopVote()` - Auto-votes after delay
- `scheduleMrBloopReady()` - Auto-ready after 1-2 seconds

#### WebSocket Messages
```typescript
{ type: "add_mr_bloop" }     // Host adds Mr Bloop
{ type: "remove_mr_bloop" }  // Host removes Mr Bloop
```

### Frontend Components

#### `useGameSocket.ts`
Added functions:
- `addMrBloop()` - Send add message
- `removeMrBloop()` - Send remove message

#### `Lobby.tsx`
- Button to add/remove Mr Bloop
- Only visible to host
- Shows "Add" or "Remove" based on current state

## Mr Bloop's Personality

### Answer Generation Strategy
```javascript
// With AI (OpenAI)
"Generate a plausible but INCORRECT answer that sounds believable"

// Without AI (Fallback)
"something involving [keyword] incorrectly"
"a common misconception about [topic]"
"what most people think but is actually wrong"
```

### Voting Strategy
```javascript
// 70% of the time
Vote for a random player's fake answer

// 30% of the time
Accidentally vote for the correct answer (realistic mistake!)

// Never
Vote for own answer or AI-generated answers
```

### Timing
```javascript
Answer submission: 3-8 seconds (random)
Voting: 3-8 seconds (random)
Ready: 1-2 seconds (quick)
```

## Configuration

### Mr Bloop Constants
```typescript
ID: "mr-bloop-ai"
Name: "Mr Bloop"
Avatar: "wizard" (Doctor Strange icon)
```

### AI Integration
- Uses OpenAI API if `AI_INTEGRATIONS_OPENAI_API_KEY` is set
- Falls back to template-based generation otherwise
- Both methods produce believable answers

## Testing Mr Bloop

### Test Scenario 1: Solo Play
1. Create a room
2. Add Mr Bloop
3. Start game (2 players: you + Mr Bloop)
4. Watch Mr Bloop submit answers and vote

### Test Scenario 2: Group Play
1. Create a room with 2+ real players
2. Add Mr Bloop as extra player
3. Mr Bloop competes alongside humans

### Test Scenario 3: AI Quality
1. Set `AI_INTEGRATIONS_OPENAI_API_KEY` in `.env`
2. Add Mr Bloop
3. Check answer quality (should be contextual and clever)

### Test Scenario 4: Fallback Mode
1. Remove or unset `AI_INTEGRATIONS_OPENAI_API_KEY`
2. Add Mr Bloop
3. Answers use template-based generation

## Limitations

### Current Limitations
- Mr Bloop cannot be removed during an active game (only in lobby)
- Only one Mr Bloop per game
- Mr Bloop doesn't chat or react to events
- Voting strategy is simple (not adaptive)

### Future Enhancements
- Multiple AI personalities
- Adaptive difficulty (smarter/dumber based on player skill)
- Chat messages from Mr Bloop
- Custom AI player names and avatars
- Learning from player behavior

## Code Structure

```
server/
├── services/
│   ├── mrBloopService.ts       # Main AI player logic
│   ├── gameEngine.ts           # Integration with game flow
│   └── aiService.ts            # OpenAI integration
└── routes.ts                   # WebSocket handlers

client/
├── hooks/
│   └── useGameSocket.ts        # Add/remove functions
├── pages/
│   └── Lobby.tsx               # UI for adding Mr Bloop
└── App.tsx                     # Pass functions to Lobby

shared/
└── schema.ts                   # Message types
```

## Example Game Flow with Mr Bloop

```
1. Lobby
   Host clicks "Add Mr Bloop (AI)"
   → Mr Bloop joins with wizard avatar

2. Start Game
   → Mr Bloop auto-ready after 1-2 seconds

3. Collect Phase
   Players submit answers
   → Mr Bloop submits after 3-8 seconds
   → Checkmark appears on Mr Bloop's avatar

4. Vote Phase
   Players vote
   → Mr Bloop votes after 3-8 seconds
   → Checkmark appears

5. Reveal Phase
   Scores calculated
   → Mr Bloop earns points if he fooled players

6. Next Round
   → Mr Bloop auto-ready
   → Cycle repeats

7. End Game
   → Mr Bloop appears in final leaderboard
   → Can win the game!
```

## API Reference

### mrBloopService

```typescript
class MrBloopService {
  // Create Mr Bloop player object
  createMrBloop(): Player

  // Check if player is Mr Bloop
  isMrBloop(playerId: string): boolean

  // Check if Mr Bloop is in room
  isInRoom(room: GameRoom): boolean

  // Generate fake answer
  async generateAnswer(
    question: string,
    correctAnswer: string,
    existingAnswers: string[]
  ): Promise<string>

  // Select answer to vote for
  selectAnswerToVote(room: GameRoom): string | null

  // Get random thinking delay
  getThinkingDelay(): number

  // Mark as ready
  setReady(room: GameRoom): void
}
```

## Troubleshooting

### Mr Bloop not submitting answers
- Check server logs for errors
- Verify `mrBloopService` is imported correctly
- Ensure room state is "collect"

### Mr Bloop not voting
- Check if voting phase started
- Verify answers are available
- Check server logs for vote errors

### AI answers not working
- Verify `AI_INTEGRATIONS_OPENAI_API_KEY` is set
- Check OpenAI API quota/limits
- Fallback should still work

### Button not showing
- Verify you are the host
- Check if Mr Bloop already in room
- Refresh the page

## Summary

✅ **Mr Bloop is fully functional!**
- Joins as a real player
- Submits clever answers
- Votes strategically
- Earns points and competes
- Works with or without OpenAI API

Perfect for testing, solo play, or adding an extra challenge to your game! 🎮🤖
