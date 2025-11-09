import { seedDatabase } from "../server/seed";

seedDatabase()
  .then(() => {
    console.log("✓ Database seeded successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  });
