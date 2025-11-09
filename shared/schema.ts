import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Deck Categories
export const deckCategories = pgTable("deck_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
});

// Decks (Classic, Country-specific, Game-themed)
export const decks = pgTable("decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => deckCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  familySafe: boolean("family_safe").notNull().default(true),
  locale: text("locale").default("en"),
});

// Prompts for each deck
export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deckId: varchar("deck_id").notNull().references(() => decks.id),
  questionText: text("question_text").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  familySafe: boolean("family_safe").notNull().default(true),
});

// TypeScript types and Zod schemas
export const insertDeckCategorySchema = createInsertSchema(deckCategories).omit({ id: true });
export const insertDeckSchema = createInsertSchema(decks).omit({ id: true });
export const insertPromptSchema = createInsertSchema(prompts).omit({ id: true });

export type DeckCategory = typeof deckCategories.$inferSelect;
export type Deck = typeof decks.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
export type InsertDeckCategory = z.infer<typeof insertDeckCategorySchema>;
export type InsertDeck = z.infer<typeof insertDeckSchema>;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;

// Power-up types
export type PowerUpType = "swap" | "spy" | null;

// Reaction types
export type ReactionType = "mind_blown" | "hilarious" | "almost_believed" | "fire";

export interface Reaction {
  playerId: string;
  playerName: string;
  reaction: ReactionType;
}

// Real-time game state types (not persisted in DB, managed in-memory via WebSocket)
export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  avatar: string;
  score: number;
  connected: boolean;
  ready?: boolean;
  submitted?: boolean;
  powerUp?: PowerUpType; // null if used, otherwise "swap" or "spy"
  usedPowerUp?: boolean; // track if power-up was used this game
}

export interface GameRoom {
  id: string;
  code: string;
  players: Player[];
  state: "lobby" | "ready" | "collect" | "vote" | "reveal" | "leaderboard" | "ended";
  currentRound: number;
  totalRounds: number;
  deckId: string;
  familySafe: boolean;
  currentPrompt?: Prompt;
  answers: Answer[];
  votes: Vote[];
  roundEndTime?: number;
  usedPromptIds?: string[]; // Track recently used prompts to avoid repeats
  settings: {
    collectTime: number; // seconds
    voteTime: number;
    revealTime: number;
    pointsCorrect: number; // points for correct answer
    pointsPerFool: number; // points per player fooled
    pointsFoolAll: number; // bonus for fooling everyone
    pointsTimeout: number; // penalty for timeout (usually negative)
  };
}

export interface Answer {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  isCorrect: boolean;
  isAI: boolean;
  votedBy: string[]; // player IDs who voted for this answer
  reactions?: Reaction[]; // reactions sent to this answer during reveal
}

export interface Vote {
  playerId: string;
  answerId: string;
}

export interface RoundResult {
  playerId: string;
  playerName: string;
  points: number;
  reason: "correct" | "fooled_others" | "fooled_all" | "timeout";
  fooledPlayers?: string[];
}

export interface GameSettings {
  totalRounds: number;
  collectTime: number;
  voteTime: number;
  revealTime: number;
  pointsCorrect: number;
  pointsPerFool: number;
  pointsFoolAll: number;
  pointsTimeout: number;
}

// WebSocket message types
export type ClientMessage =
  | { type: "create_room"; playerName: string; avatar: string; deckId: string; familySafe: boolean; settings?: Partial<GameSettings> }
  | { type: "join_room"; roomCode: string; playerName: string; avatar: string }
  | { type: "start_game" }
  | { type: "player_ready" }
  | { type: "submit_answer"; text: string }
  | { type: "submit_vote"; answerId: string }
  | { type: "next_round" }
  | { type: "end_game" }
  | { type: "leave_room" }
  | { type: "update_settings"; settings: Partial<GameSettings> }
  | { type: "add_mr_bloop" }
  | { type: "remove_mr_bloop" }
  | { type: "send_reaction"; answerId: string; reaction: ReactionType }
  | { type: "use_power_up"; powerUp: PowerUpType };

export type ServerMessage =
  | { type: "room_created"; room: GameRoom; playerId: string }
  | { type: "room_joined"; room: GameRoom; playerId: string }
  | { type: "room_updated"; room: GameRoom }
  | { type: "game_started"; room: GameRoom }
  | { type: "phase_changed"; phase: GameRoom["state"]; room: GameRoom }
  | { type: "round_results"; results: RoundResult[]; room: GameRoom }
  | { type: "error"; message: string }
  | { type: "player_joined"; player: Player }
  | { type: "player_left"; playerId: string }
  | { type: "reaction_added"; answerId: string; reaction: Reaction }
  | { type: "spy_votes_update"; voteCount: number }; // For spy power-up
