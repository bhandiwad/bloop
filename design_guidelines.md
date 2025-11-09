# Bloop Design Guidelines

## Design Approach
**Reference-Based:** Drawing from successful party games like Jackbox Games, Psych, and Kahoot, combined with modern mobile gaming aesthetics. The design prioritizes playful energy, instant visual feedback, and crystal-clear game state communication.

## Core Design Principles
1. **Instant Clarity**: Every game phase must be immediately recognizable
2. **Playful Energy**: Bold colors and micro-animations create party atmosphere
3. **Mobile-First Touch**: All interactions designed for thumbs, minimum 44px touch targets
4. **Real-time Delight**: Visual feedback for every player action within 100ms

---

## Color Palette

### Light Mode
- **Primary Brand**: 260 85% 58% (vibrant purple - playful, premium)
- **Secondary**: 200 90% 52% (electric blue - trust, energy)
- **Success**: 150 70% 45% (correct answers, wins)
- **Warning**: 35 95% 58% (rapid-fire mode, urgency)
- **Danger**: 0 85% 60% (time running out, incorrect)
- **Background**: 240 20% 98% (soft white)
- **Surface**: 0 0% 100% (cards, modals)
- **Text Primary**: 240 15% 15% (high contrast)
- **Text Secondary**: 240 8% 45%

### Dark Mode (Default for Gaming)
- **Primary Brand**: 260 75% 65% (lighter purple for dark bg)
- **Secondary**: 200 80% 60%
- **Success**: 150 60% 52%
- **Warning**: 35 90% 65%
- **Danger**: 0 75% 65%
- **Background**: 240 15% 8% (deep charcoal)
- **Surface**: 240 12% 12% (elevated cards)
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 240 5% 70%

---

## Typography

**Fonts**:
- **Display/Headings**: Fredoka (Google Fonts) - playful, rounded, perfect for game titles
- **Body/UI**: Inter (Google Fonts) - readable, modern, excellent at small sizes

**Scale**:
- Game Title: text-6xl font-bold (Fredoka)
- Phase Headers: text-4xl font-extrabold (Fredoka)
- Card Titles: text-2xl font-semibold (Fredoka)
- Prompts: text-xl font-medium (Inter)
- Body Text: text-base (Inter)
- Timer/Counters: text-5xl font-bold tabular-nums (Fredoka)
- Buttons: text-lg font-semibold (Inter)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm

**Container Strategy**:
- Max width: max-w-2xl (game fits comfortably on mobile and tablet)
- Padding: px-4 md:px-6 (breathing room on all devices)
- Safe areas: pb-8 for bottom navigation avoidance

**Grid Patterns**:
- Answer cards: grid-cols-1 gap-3 (mobile), md:grid-cols-2 gap-4 (tablet+)
- Player avatars: flex flex-wrap gap-2
- Leaderboard: Single column with ranks

---

## Component Library

### Navigation & Structure
- **Top Bar**: Fixed position, glass-morphism effect (backdrop-blur-lg bg-surface/80), shows room code and phase
- **Bottom Action Bar**: Fixed, prominent CTA button, timer display
- **Phase Indicator**: Animated progress bar showing Collect → Vote → Reveal

### Game Components

**Answer Cards**:
- Rounded-2xl borders with subtle shadows
- Min height: h-24 for comfortable reading
- Hover state: scale-102 with shadow-lg
- Active/selected: ring-4 ring-primary
- Player attribution badge (small pill, top-right)

**Timer Display**:
- Circular progress ring (using SVG)
- Large centered countdown (text-5xl)
- Color transitions: blue (safe) → warning (10s) → danger (5s)
- Pulse animation when < 5s

**Vote Buttons**:
- Full-width on mobile
- Height: h-16 (easy thumb target)
- Background: gradient from primary to secondary
- Pressed state: scale-95 transform
- Disabled state: opacity-50 with cursor-not-allowed

**Player Cards (Lobby/Leaderboard)**:
- Avatar: w-12 h-12 rounded-full with colored ring
- Name: Truncate at 16 chars
- Score badge: Positioned top-right, rounded-full with shadow
- Host crown icon for room creator

**Prompt Display**:
- Centered card with rounded-3xl
- Generous padding: p-8
- Background: gradient subtle overlay
- Category badge: Top-left corner pill
- Deck indicator: Bottom-right subtle text

### Interactive Elements

**Primary Button**:
- Rounded-full for playful feel
- Height: h-14 (mobile), h-12 (desktop)
- Shadow-xl with hover shadow-2xl
- Gradient background (primary → secondary)
- White text with font-semibold

**Input Fields**:
- Rounded-xl borders
- Height: h-14 for comfortable typing
- Focus: ring-2 ring-primary
- Dark mode: bg-surface with lighter text
- Character counter (top-right, absolute)

**Confetti Animation**:
- Canvas-based particle system
- Triggers: Correct answer, round win, game complete
- Duration: 3s with fadeout
- Colors: Primary, secondary, success palette

### Modals & Overlays
- Backdrop: backdrop-blur-sm bg-black/50
- Panel: rounded-3xl with shadow-2xl
- Max width: max-w-md
- Padding: p-6
- Close button: Absolute top-right, w-10 h-10

---

## Game Phase Designs

### Home Screen
- Large Bloop logo (Fredoka, gradient text)
- Two prominent buttons: "Create Room" (primary), "Join Room" (outline)
- Deck selector carousel at bottom
- Family-Safe toggle (clearly visible)

### Lobby
- Room code display (large, copyable)
- Player grid showing avatars in real-time
- Settings button (top-right gear icon)
- "Start Game" button (host only, floating bottom)
- Waiting animation: Gentle pulse on player cards

### Collect Phase
- Prompt card centered top
- Text input: Large, autofocused
- Submit button: Disabled until min chars entered
- Timer: Top-right corner
- Real-time player submission indicators (avatars gray out when submitted)

### Vote Phase
- Prompt reminder at top (smaller)
- Answer cards: Stacked vertically with generous spacing
- Selected card: Highlighted with ring and slight scale
- Timer: Central, more urgent styling
- "Waiting for others" state after vote

### Reveal Phase
- Animated card flips showing correct answer
- Score popups (+2, +1) with spring animation
- Player names revealed on cards they wrote
- "Fooled by" indicators
- Running score tally animation

### Leaderboard
- Podium display for top 3 (1st larger, gold tint)
- Full ranking list below
- Score change indicators (↑ +3 in green)
- "Next Round" button
- "End Game" option (host only)

---

## Animations

**Use Sparingly**:
- Card entrance: Slide-up with fade (duration-300)
- Score updates: Scale-pulse (duration-200)
- Timer urgency: Pulse when < 10s
- Phase transitions: Fade-through-black (duration-500)
- Success states: Confetti + scale-in (duration-400)

**Reduce Motion Respect**:
- Disable all animations when `prefers-reduced-motion`
- Instant state changes only
- Keep core functionality accessible

---

## Images

**Hero Image**: No traditional hero image - the game logo is text-based with gradient treatment

**In-Game Images**:
- Deck category icons (64x64 rounded icons for Classic, Country flags, Game logos)
- Player avatars (generated or uploaded, 48x48 circular)
- Placeholder: Use colorful geometric patterns when no custom avatar

**Icon Library**: Heroicons (outline for UI, solid for active states)

---

## Accessibility

- Minimum touch target: 44x44px everywhere
- Focus indicators: ring-2 ring-offset-2
- ARIA labels on all interactive elements
- Font scaling: Support 100%-200% via relative units
- High contrast mode: Increase border weights, remove subtle gradients
- Screen reader announcements for timer, phase changes, score updates
- Keyboard navigation: Full tab support with visible focus rings

---

## PWA Manifest

- Theme color: 260 85% 58% (primary purple)
- Background color: 240 15% 8% (dark background)
- Display: standalone
- Icons: 192x192, 512x512 (colorful Bloop logo on transparent)
- Orientation: portrait-primary (lock to portrait on mobile)