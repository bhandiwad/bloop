import { db } from "../server/db";
import { decks } from "@shared/schema";
import { eq } from "drizzle-orm";

async function updateDeckNames() {
  console.log("🔄 Updating deck names from Psych to Bloop...");

  try {
    // Update Psych Words to Bloop Words
    const psychWords = await db.query.decks.findFirst({
      where: eq(decks.name, "Psych Words"),
    });

    if (psychWords) {
      await db.update(decks)
        .set({ name: "Bloop Words" })
        .where(eq(decks.id, psychWords.id));
      console.log("✅ Updated Psych Words → Bloop Words");
    }

    // Update Psych Facts to Bloop Facts
    const psychFacts = await db.query.decks.findFirst({
      where: eq(decks.name, "Psych Facts"),
    });

    if (psychFacts) {
      await db.update(decks)
        .set({ name: "Bloop Facts" })
        .where(eq(decks.id, psychFacts.id));
      console.log("✅ Updated Psych Facts → Bloop Facts");
    }

    console.log("✨ Deck names updated successfully!");
  } catch (error) {
    console.error("❌ Error updating deck names:", error);
  }

  process.exit(0);
}

updateDeckNames();
