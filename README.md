# Bloop - Real-time Party Game

A real-time, multiplayer party game inspired by Psych, Jackbox Games, and Kahoot. Players compete by submitting creative fake answers to trivia prompts, trying to fool opponents while guessing the correct answer themselves.

## Features

- 🎮 Real-time multiplayer gameplay via WebSockets
- 🎨 Mobile-first Progressive Web App design
- 🎯 Multiple themed decks (Classic, Country, Game-themed)
- 🔒 Family-safe content filtering
- 🏆 Dynamic scoring system with bluffing bonuses
- 🎊 Celebration animations when fooling players
- 💾 Redis-backed persistent game rooms (production)
- 🐳 Docker Compose for easy deployment

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Redis (for production)

### Development Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Initialize Database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Server will auto-seed on first run
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:5000`
   
   > **Note:** Redis is optional in development. The app will use in-memory storage if Redis is unavailable.

## Docker Deployment (Production)

The easiest way to run Bloop in production is using Docker Compose, which sets up PostgreSQL, Redis, and the application automatically.

### 1. Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### 2. Access the Application

Open `http://localhost:5000` in your browser.

### 3. Environment Variables

The docker-compose.yml includes default configuration. For production, update:

- Database password
- SESSION_SECRET (generate with `openssl rand -hex 32`)
- Optional: AI_INTEGRATIONS_OPENAI_API_KEY for AI-generated answers

## Manual Production Deployment

If you prefer not to use Docker:

### 1. Install Dependencies

```bash
npm ci --only=production
```

### 2. Build the Application

```bash
npm run build
```

### 3. Set Environment Variables

```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://user:password@host:5432/bloop"
export REDIS_URL="redis://localhost:6379"
export SESSION_SECRET="your-secret-key-here"
export PORT=5000
```

### 4. Run Database Migrations

```bash
# Use the provided SQL migration
psql $DATABASE_URL < migrations/001_initial_schema.sql
```

### 5. Start the Server

```bash
node dist/index.js
```

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS + shadcn/ui components
- Framer Motion for animations
- TanStack Query for state management
- WebSocket client for real-time updates

### Backend
- Node.js + Express + TypeScript
- Native WebSocket (ws library)
- PostgreSQL with Drizzle ORM
- Redis for game state persistence
- Modular service architecture

## Game Flow

1. **Lobby** - Host creates room, players join with 6-digit code
2. **Collect** (180s) - Players submit fake answers to a question
3. **Vote** (60s) - Players vote on answers (including the correct one)
4. **Reveal** (10s) - Shows correct answer and who was fooled
5. **Leaderboard** - Displays scores (+2 correct, +1 per fool, +2 bonus for fooling everyone)

## Development Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run db:push          # Sync database schema
npm run db:studio        # Open Drizzle Studio (database GUI)

# Production
npm run build            # Build for production
npm start                # Start production server

# Docker
docker-compose up        # Start all services
docker-compose up --build # Rebuild and start
docker-compose down      # Stop all services
```

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── hooks/       # Custom hooks (WebSocket, etc.)
├── server/              # Express backend
│   ├── services/        # Game logic, AI, moderation
│   │   ├── gameEngine.ts
│   │   ├── scoringService.ts
│   │   ├── redisGameStore.ts
│   │   └── moderationService.ts
│   ├── routes.ts        # WebSocket & REST endpoints
│   ├── redis.ts         # Redis client configuration
│   └── index.ts         # Server entry point
├── shared/              # Shared types between client/server
│   └── schema.ts
├── migrations/          # Database migrations
├── docker-compose.yml   # Docker orchestration
├── Dockerfile           # Container definition
└── .env.example         # Environment template
```

## Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string (required in production)
- `SESSION_SECRET` - Secret key for sessions
- `AI_INTEGRATIONS_OPENAI_API_KEY` - (Optional) OpenAI API key

### Game Settings

Timer durations can be adjusted in `server/services/gameEngine.ts`:

```typescript
settings: {
  collectTime: 180,  // seconds
  voteTime: 60,
  revealTime: 10,
}
```

## Troubleshooting

### Redis Connection Errors

**Development:** Redis is optional. The app will use in-memory storage and show a warning.

**Production:** Redis is required. Ensure Redis is running and `REDIS_URL` is set correctly.

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check database user has necessary permissions
4. Run migrations: `psql $DATABASE_URL < migrations/001_initial_schema.sql`

### Port Already in Use

Change the PORT environment variable:
```bash
export PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
