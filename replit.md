# Bloop - Real-time Party Game

## Overview

Bloop is a real-time, multiplayer party game inspired by Psych, Jackbox Games, and Kahoot. Players compete by submitting creative fake answers to trivia prompts, trying to fool opponents while guessing the correct answer themselves. The game features multiple themed decks (Classic, Country-specific, Game-themed), real-time WebSocket gameplay with distinct phases (Collect, Vote, Reveal, Leaderboard), and contextual fallback answers when player count is low. It's designed as a mobile-first Progressive Web App with playful animations, family-safe content filtering, and accessibility features.

## Recent Changes (October 21, 2025)

1. **Avatar Selection**: Players can choose from 16 preset avatar icons (Happy, Star, Heart, Lightning, etc.) when joining or creating games. Avatars displayed throughout UI (Lobby, Game, Leaderboard). Avatar preferences persist in localStorage. Icons use lucide-react for consistency with existing design system.

2. **Sound Effects System**: Implemented tone-based sound manager with 7 distinct sounds (submit, vote, reveal, correct, fooled, tick, transition). Sound toggle available on Home and Lobby pages with localStorage persistence. Sounds integrate with confetti animations for enhanced player feedback.

3. **Game Customization**: Hosts can configure game settings before starting (rounds: 1-10, timers, point values). Settings dialog integrated into Lobby with real-time updates. All settings validated and applied server-side through WebSocket.

4. **Shareable Results**: Players can share game results via clipboard on the final leaderboard. Share button generates formatted text summary showing final standings, winner, and total rounds. All players can share results, not just the host.

5. **Production Hardening**: Added fail-fast SESSION_SECRET validation on app startup. Wrapped all Redis operations in try/catch with automatic in-memory fallback. Enhanced Docker migration error handling to fail container on critical errors while tolerating "already exists" warnings.

6. **PWA Offline Support**: Implemented Workbox service worker (public/sw.js) with cache-first strategy for static assets and network-first for API calls. Registered in client/src/main.tsx (production only). WebSocket traffic unaffected, preserving real-time gameplay.

7. **Celebration Confetti**: Added canvas-confetti animations for celebration moments. Side cannons fire when player successfully Bloops others (Reveal phase). Confetti rain celebrates earning points (Leaderboard phase). Guards prevent multiple triggers during same phase.

## Previous Changes (October 20, 2025)

1. **Fixed Game Progression**: Implemented onPhaseChange callback system in GameEngine to properly broadcast Reveal→Leaderboard transitions. Game now automatically advances through all phases without getting stuck.

2. **Bloop'ed Notifications**: Added celebration message in Reveal phase showing which players were fooled by your fake answer (e.g., "Alice, Bob got Bloop'ed by you!"). Uses Trophy icon for visual emphasis (no emojis per design guidelines).

3. **Contextual Fallback Answers**: Enhanced fallback answer generation to extract keywords from questions and incorporate them into templates. Instead of generic "Something mysterious", now generates context-aware answers like "The common photosynthesis theory" or "What people confuse with photosynthesis". AI generation permanently disabled due to OpenAI content filter violations.

4. **Username Persistence**: Implemented localStorage to remember player names across sessions. Names automatically pre-fill when returning to the game, eliminating need to re-enter.

5. **Timer Adjustments**: Updated phase timers based on user testing - Collect: 180s (3 min), Vote: 60s, Reveal: 10s.

## User Preferences

Preferred communication style: Simple, everyday language.
Design constraints: No emojis allowed - use lucide-react icons instead.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with Vite for fast development and building. TypeScript for type safety across the application.

**UI Framework**: Tailwind CSS for styling with shadcn/ui component library (Radix UI primitives). Custom design system based on "new-york" style with playful party game aesthetics using Fredoka font for headings and Inter for body text.

**State Management**: TanStack Query (React Query) for server state and caching. Local component state with React hooks for UI interactions. Custom WebSocket hook (`useGameSocket`) manages real-time game state.

**Real-time Communication**: WebSocket client connecting to `/ws` endpoint for live game updates. Handles bidirectional messages for room creation, player actions, game state synchronization, and round results.

**Routing Strategy**: Single-page application with conditional rendering based on game state (Home → Lobby → Game phases). No traditional router; state-driven page transitions.

**Animation**: Framer Motion for smooth transitions, micro-interactions, and phase indicators. Canvas-confetti library for celebration effects (side cannons when Blooping others, confetti rain on leaderboard).

**PWA Features**: Manifest file for installability, mobile-optimized with meta tags for standalone mode and theme colors. Workbox service worker provides offline support with cache-first strategy for static assets (fonts, CSS, JS) and network-first for API calls. WebSocket traffic bypassed to preserve real-time gameplay.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js. Development uses `tsx` for hot reloading; production builds with esbuild.

**API Design**: Hybrid REST + WebSocket architecture. REST endpoints for static data (deck lists). WebSocket for all real-time gameplay (room management, answer submission, voting, scoring).

**WebSocket Implementation**: Native `ws` library with custom message typing via shared TypeScript schemas. Maintains player-to-socket mapping for targeted message delivery. Supports connection state tracking and reconnection handling.

**Game Engine**: Modular service architecture with separate concerns:
- `GameEngine`: Manages room lifecycle, player state, round progression, and answer/vote collection
- `ScoringService`: Calculates points based on correct answers (+2), fooling others (+1 per fool, +2 bonus for fooling everyone), and timeouts (-1)
- `AIService`: Generates believable fake answers using OpenAI API when player count is insufficient
- `ModerationService`: Filters inappropriate content using blocklists, supports family-safe mode

**Session Management**: In-memory room storage using Map structures. Ephemeral game state (no persistence of active games). Player sessions tied to WebSocket connections.

### Data Architecture

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket support. Drizzle ORM for type-safe queries and schema management.

**Schema Design**:
- `deck_categories`: Organizes decks by theme (Classic, Country, Games)
- `decks`: Individual game decks with metadata (name, description, family_safe flag, locale)
- `prompts`: Question-answer pairs linked to decks, includes family_safe filtering

**Data Access Layer**: Repository pattern via `storage` module implementing `IStorage` interface. Centralizes database operations for decks, categories, and prompts. Supports random prompt selection for gameplay.

**Real-time State**: Game rooms, players, answers, votes, and timers stored in-memory on the server. Not persisted to database; ephemeral session data only. Allows for fast state updates without database overhead.

**Seeding Strategy**: Database initialization checks for existing decks and seeds ~300 prompts across multiple categories on first run. JSON import format planned for future deck additions.

### External Dependencies

**Database Service**: 
- Neon PostgreSQL (serverless, WebSocket-compatible)
- Connection via `@neondatabase/serverless` package
- Database URL via environment variable `DATABASE_URL`

**AI Integration**:
- OpenAI API for generating fake answers when needed
- Configurable via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
- Fallback mechanism when API unavailable
- GPT-4o-mini model for cost-effective generation

**UI Component Library**:
- Radix UI primitives for accessible, unstyled components
- shadcn/ui configuration for consistent styling
- Extensive use of dialogs, popovers, tooltips, cards, badges

**Build & Development Tools**:
- Vite for frontend bundling and dev server with HMR
- esbuild for production server bundling
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner

**Fonts**:
- Google Fonts: Fredoka (display/headings), Inter (body/UI)
- Preconnected in HTML for performance

**Styling**:
- Tailwind CSS with PostCSS
- Custom design tokens for colors, borders, shadows
- Dark mode support via class-based strategy
- Responsive breakpoints for mobile-first design

**Type Safety**:
- Zod for runtime validation
- `drizzle-zod` for automatic schema-to-validator generation
- Shared TypeScript types between client and server via `@shared` alias

**Animation**:
- Framer Motion for component animations
- Embla Carousel for any carousel needs
- Custom confetti component using canvas API