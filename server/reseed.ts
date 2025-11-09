import { seedDatabase } from "./seed";
import { db } from "./db";
import { deckCategories, decks, prompts } from "@shared/schema";

async function reseedDatabase() {
  console.log("🗑️  Clearing existing data...");
  
  try {
    // Delete in correct order (prompts -> decks -> categories)
    await db.delete(prompts);
    console.log("   ✓ Cleared prompts");
    
    await db.delete(decks);
    console.log("   ✓ Cleared decks");
    
    await db.delete(deckCategories);
    console.log("   ✓ Cleared categories");
    
    console.log("\n🌱 Seeding database with updated content...");
    await seedDatabase();
    
    console.log("\n✅ Re-seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during re-seeding:", error);
    process.exit(1);
  }
}

reseedDatabase();
