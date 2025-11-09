import {
  deckCategories,
  decks,
  prompts,
  type DeckCategory,
  type Deck,
  type Prompt,
  type InsertDeckCategory,
  type InsertDeck,
  type InsertPrompt,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Deck Categories
  getAllDeckCategories(): Promise<DeckCategory[]>;
  createDeckCategory(category: InsertDeckCategory): Promise<DeckCategory>;

  // Decks
  getAllDecks(): Promise<Deck[]>;
  getDeckById(id: string): Promise<Deck | undefined>;
  getDecksByCategory(categoryId: string): Promise<Deck[]>;
  createDeck(deck: InsertDeck): Promise<Deck>;

  // Prompts
  getPromptsByDeck(deckId: string): Promise<Prompt[]>;
  getRandomPrompt(deckId: string, familySafe: boolean): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
}

export class DatabaseStorage implements IStorage {
  // Deck Categories
  async getAllDeckCategories(): Promise<DeckCategory[]> {
    return await db.select().from(deckCategories);
  }

  async createDeckCategory(category: InsertDeckCategory): Promise<DeckCategory> {
    const [result] = await db
      .insert(deckCategories)
      .values(category)
      .returning();
    return result;
  }

  // Decks
  async getAllDecks(): Promise<Deck[]> {
    return await db.select().from(decks);
  }

  async getDeckById(id: string): Promise<Deck | undefined> {
    const [deck] = await db.select().from(decks).where(eq(decks.id, id));
    return deck || undefined;
  }

  async getDecksByCategory(categoryId: string): Promise<Deck[]> {
    return await db.select().from(decks).where(eq(decks.categoryId, categoryId));
  }

  async createDeck(deck: InsertDeck): Promise<Deck> {
    const [result] = await db.insert(decks).values(deck).returning();
    return result;
  }

  // Prompts
  async getPromptsByDeck(deckId: string): Promise<Prompt[]> {
    return await db.select().from(prompts).where(eq(prompts.deckId, deckId));
  }

  async getRandomPrompt(deckId: string, familySafe: boolean): Promise<Prompt | undefined> {
    const allPrompts = await db
      .select()
      .from(prompts)
      .where(eq(prompts.deckId, deckId));

    const filtered = familySafe
      ? allPrompts.filter((p) => p.familySafe)
      : allPrompts;

    if (filtered.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const [result] = await db.insert(prompts).values(prompt).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
