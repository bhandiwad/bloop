import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { storage } from "./storage";
import { connectRedis } from "./redis";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Validate SESSION_SECRET is set and secure
  const sessionSecret = process.env.SESSION_SECRET;
  const insecureDefaults = [
    "INSECURE_CHANGE_THIS_IN_PRODUCTION",
    "changeme_generate_secure_session_secret",
    "default",
    "secret",
  ];

  if (!sessionSecret) {
    log("FATAL ERROR: SESSION_SECRET environment variable is not set");
    log("Generate a secure secret with: openssl rand -hex 32");
    process.exit(1);
  }

  if (insecureDefaults.includes(sessionSecret)) {
    log("FATAL ERROR: SESSION_SECRET is set to an insecure default value");
    log("Generate a secure secret with: openssl rand -hex 32");
    log("Set it in your .env file or Docker Compose environment");
    process.exit(1);
  }

  if (sessionSecret.length < 32) {
    log("WARNING: SESSION_SECRET should be at least 32 characters for security");
  }

  // Try to connect to Redis (optional in development)
  if (process.env.REDIS_URL) {
    try {
      await connectRedis();
      log("✓ Connected to Redis for persistent game state");
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        log("ERROR: Redis is required in production for game state management.");
        log("Please ensure Redis is running and REDIS_URL is configured.");
        process.exit(1);
      } else {
        log("⚠ Redis connection failed - using in-memory fallback (development only)");
        log("  Game rooms will not persist across server restarts");
      }
    }
  } else {
    log("⚠ Redis not configured - using in-memory fallback (development only)");
    log("  Game rooms will not persist across server restarts");
  }

  try {
    log("Checking database...");
    const existingDecks = await storage.getAllDecks();
    log(`Found ${existingDecks.length} decks in database`);
    if (existingDecks.length === 0) {
      log("Database is empty, seeding...");
      await seedDatabase();
    } else {
      log(`Database already seeded with ${existingDecks.length} decks`);
    }
  } catch (error) {
    log("Error checking/seeding database:", String(error));
    log("Stack:", error instanceof Error ? error.stack : "");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
