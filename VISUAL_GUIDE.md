# 🎨 Visual Guide - Bloop UI Components

## 🏠 Home Screen

### Before (Dropdown)
```
┌─────────────────────────┐
│ Choose Deck             │
│ ┌─────────────────────┐ │
│ │ Classic - Word Up ▼ │ │
│ └─────────────────────┘ │
│                         │
│ [Create Room]           │
└─────────────────────────┘
```

### After (Carousel)
```
┌─────────────────────────────────┐
│ Choose Your Deck                │
│ ┌─────────────────────────────┐ │
│ │  📚                    [<] │ │
│ │  Classic                    │ │
│ │  Psych Words                │ │
│ │  Weird word definitions     │ │
│ │  that sound made up         │ │
│ │                             │ │
│ │  ●●○○○  1/5            [>] │ │
│ └─────────────────────────────┘ │
│                                 │
│ [▶ Play with Psych Words]       │
└─────────────────────────────────┘
```

**Features:**
- Large emoji icon (6xl)
- Category badge
- Descriptive text
- Navigation arrows
- Progress dots
- Play button integrated

---

## 🔢 Room Code Input

### Before (6 chars, small)
```
┌──────────────┐
│ ABC123       │
└──────────────┘
```

### After (4 chars, large)
```
┌──────────────────┐
│                  │
│   A  B  3  K     │
│                  │
└──────────────────┘
```

**Styling:**
- Height: 64px (h-16)
- Font: 36px (text-4xl)
- Tracking: 0.5em (wide spacing)
- Uppercase auto-applied
- Centered text

---

## ✋ Ready Screen

```
┌─────────────────────────────────┐
│                                 │
│         Round 1                 │
│    Are you ready?               │
│                                 │
│  ⏰ 2 of 4 players ready        │
│                                 │
│  ┌──────┐ ┌──────┐             │
│  │ 😀   │ │ 🎮 ✓ │             │
│  │ Alex │ │ Sam  │             │
│  └──────┘ └──────┘             │
│  ┌──────┐ ┌──────┐             │
│  │ 🎨   │ │ 🎯 ✓ │             │
│  │ Pat  │ │ Jo   │             │
│  └──────┘ └──────┘             │
│                                 │
│  [   I'm Ready!   ]             │
│                                 │
│  Starting round...              │
└─────────────────────────────────┘
```

**Features:**
- Huge round number (5xl-6xl)
- Player grid (2-3 columns)
- Green border + checkmark when ready
- Progress counter
- Big blue button
- Auto-start message

---

## 🎉 Bloop'd Message

```
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗   │
│ ║                           ║   │
│ ║      BLOOP'D              ║   │
│ ║      ─────────            ║   │
│ ║                           ║   │
│ ║        ALEX               ║   │
│ ║        SAM                ║   │
│ ║                           ║   │
│ ║      GOT YOU!             ║   │
│ ║                           ║   │
│ ╚═══════════════════════════╝   │
└─────────────────────────────────┘
```

**Styling:**
- Full-screen overlay
- Gradient: chart-4 → chart-3 → chart-2
- White text (4xl-6xl)
- Bold font-display
- Uppercase names
- Border: 4px white
- Shadow: 2xl
- Animated entrance (scale + rotate)

**Animation:**
```
0.0s: Scale 0, Rotate -10°
0.6s: Scale 1, Rotate 0°
4.0s: Dismiss
```

---

## 🏆 End Game Screen

```
┌─────────────────────────────────┐
│         🏆 👑                   │
│                                 │
│      Game Over!                 │
│      Alex wins!                 │
│                                 │
│  ┌─ Final Scores ─────────────┐ │
│  │ ┌─────────────────────────┐ │ │
│  │ │ #1  😀 Alex    👑  250 │ │ │
│  │ │         points         │ │ │
│  │ └─────────────────────────┘ │ │
│  │ ┌─────────────────────────┐ │ │
│  │ │ #2  🎮 Sam        180  │ │ │
│  │ │         points         │ │ │
│  │ └─────────────────────────┘ │ │
│  │ ┌─────────────────────────┐ │ │
│  │ │ #3  🎨 Pat        120  │ │ │
│  │ │         points         │ │ │
│  │ └─────────────────────────┘ │ │
│  └─────────────────────────────┘ │
│                                 │
│  [🏠 Return to Home]            │
└─────────────────────────────────┘
```

**Features:**
- Trophy + crown icons
- Winner highlighted (gradient bg)
- Rankings numbered
- Staggered animation (0.1s delay each)
- Large score display (3xl)
- Clear return button

---

## 🍔 Host Menu

```
┌─────────────────────────────────┐
│ ☰  Host Menu                    │
│    Manage your game room        │
│                                 │
│ ┌─ Room Code ─────────────────┐ │
│ │  AB3K              [📋]     │ │
│ └─────────────────────────────┘ │
│                                 │
│ Players (4)                     │
│ ┌─────────────────────────────┐ │
│ │ 😀 Alex (Host)  250 pts     │ │
│ │ 🎮 Sam          180 pts     │ │
│ │ 🎨 Pat          120 pts [❌]│ │
│ │ 🎯 Jo           90 pts  [❌]│ │
│ └─────────────────────────────┘ │
│                                 │
│ [🔊 Sound Options]              │
│ [⚙️  Game Settings]             │
│ [🏠 End Game]                   │
└─────────────────────────────────┘
```

**Features:**
- Slide-out sheet from right
- Room code with copy button
- Players list with scores
- Remove player buttons
- Action buttons
- Confirmation on end game

---

## 🎮 Game Header

### Before
```
┌─────────────────────────────────┐
│ Round 2/5  Code: ABC123  ⏱ 1:30│
└─────────────────────────────────┘
```

### After (with Host Menu)
```
┌─────────────────────────────────┐
│ Round 2/5  Code: AB3K    [⏱] ☰ │
└─────────────────────────────────┘
```

**Changes:**
- Timer only shows when enabled (> 0)
- Host menu icon (hamburger)
- 4-char room code
- Cleaner layout

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Stack elements vertically
- Full-width buttons
- 2-column player grid
- Smaller text (4xl → 3xl)
- Touch-friendly targets (min 44px)

### Desktop (≥ 768px)
- Max width: 4xl (896px)
- 3-column player grid
- Larger text (6xl)
- Hover states
- Side-by-side layouts

---

## 🎨 Color Usage

### States
```
Ready:      chart-3 (green)
Winner:     chart-4 (gold)
Celebrate:  chart-4 → chart-3 → chart-2 (gradient)
Error:      destructive (red)
Muted:      muted-foreground (gray)
Primary:    primary (blue)
```

### Borders
```
Default:    border (subtle)
Selected:   border-primary (2px)
Winner:     ring-2 ring-chart-4
Ready:      border-chart-3 (2px)
```

### Backgrounds
```
Card:       bg-card
Muted:      bg-muted/50
Success:    bg-chart-3/10
Winner:     bg-gradient-to-r from-chart-4/20 to-chart-3/20
Overlay:    bg-gradient-to-br from-chart-4 via-chart-3 to-chart-2
```

---

## ✨ Animation Patterns

### Entrance
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Exit
```javascript
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.2 }}
```

### Celebration
```javascript
initial={{ scale: 0, rotate: -10 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ type: "spring", duration: 0.6 }}
```

### Stagger
```javascript
transition={{ delay: index * 0.1 }}
```

---

## 🎯 Interactive States

### Button States
```
Default:    bg-primary text-primary-foreground
Hover:      bg-primary/90
Active:     bg-primary/80
Disabled:   bg-muted text-muted-foreground opacity-50
```

### Card States
```
Default:    border-border
Hover:      border-primary/50 shadow-md
Selected:   border-primary ring-2 ring-primary/30
```

### Input States
```
Default:    border-input
Focus:      ring-2 ring-primary
Error:      border-destructive ring-2 ring-destructive/20
```

---

## 📐 Spacing Scale

```
Gap between elements:  gap-2 (8px)
Card padding:          p-4 (16px) or p-6 (24px)
Section spacing:       space-y-4 (16px) or space-y-6 (24px)
Page padding:          p-4 (16px)
Button height:         h-14 (56px) or h-16 (64px)
```

---

## 🔤 Typography Scale

```
Display:    text-6xl (60px) - Round numbers, titles
Large:      text-4xl (36px) - Room codes, names
Medium:     text-2xl (24px) - Headings
Base:       text-base (16px) - Body text
Small:      text-sm (14px) - Labels
Tiny:       text-xs (12px) - Badges, hints
```

---

This visual guide shows the exact layout and styling of all new components!
