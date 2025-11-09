import { storage } from "./storage";

export async function seedImprovedMovieBluff() {
  console.log("🎬 Adding improved Movie Bluff questions...");

  const categories = await storage.getAllDeckCategories();
  const classicCategory = categories.find((c) => c.name === "Classic");
  
  if (!classicCategory) {
    console.log("Classic category not found, skipping");
    return;
  }

  // Find existing Movie Bluff deck
  const decks = await storage.getDecksByCategory(classicCategory.id);
  const movieBluffDeck = decks.find((d) => d.name === "Movie Bluff");
  
  if (!movieBluffDeck) {
    console.log("Movie Bluff deck not found, skipping");
    return;
  }

  // Trickier questions with more specific, obscure details
  const trickyMoviePrompts = [
    {
      q: "In 'The Sixth Sense', what color are the doorknobs in scenes where ghosts appear?",
      a: "red",
    },
    {
      q: "What fake movie does Tom Cruise's character pitch in 'Tropic Thunder'?",
      a: "a sequel about a gay monk",
    },
    {
      q: "In 'Pulp Fiction', what does Marcellus Wallace's briefcase contain?",
      a: "it's never revealed (glowing gold light)",
    },
    {
      q: "What song plays during the torture scene in 'Reservoir Dogs'?",
      a: "Stuck in the Middle with You",
    },
    {
      q: "In 'The Shining', what room number is Danny told never to enter?",
      a: "Room 237",
    },
    {
      q: "What does Tyler Durden do for a living in 'Fight Club'?",
      a: "makes and sells soap",
    },
    {
      q: "In 'Inception', what object does Cobb use as his totem?",
      a: "a spinning top",
    },
    {
      q: "What is the name of the AI computer in '2001: A Space Odyssey'?",
      a: "HAL 9000",
    },
    {
      q: "In 'The Matrix', what color pill does Neo take?",
      a: "the red pill",
    },
    {
      q: "What does Hannibal Lecter serve to the census taker in 'The Silence of the Lambs'?",
      a: "his liver with fava beans and a nice Chianti",
    },
    {
      q: "In 'Parasite', what food does the housekeeper's husband hide in the bunker?",
      a: "ram-don (jjapaguri)",
    },
    {
      q: "What is the name of the hotel in 'The Grand Budapest Hotel'?",
      a: "The Grand Budapest Hotel",
    },
    {
      q: "In 'Whiplash', what tempo does Fletcher demand Andrew play at?",
      a: "rushing or dragging (not quite his tempo)",
    },
    {
      q: "What planet do they visit first in 'Interstellar'?",
      a: "Miller's planet (the water planet)",
    },
    {
      q: "In 'Get Out', what triggers the hypnosis?",
      a: "a teacup and spoon",
    },
    {
      q: "What language do the aliens speak in 'Arrival'?",
      a: "Heptapod (circular symbols)",
    },
    {
      q: "In 'Eternal Sunshine', what company erases memories?",
      a: "Lacuna Inc.",
    },
    {
      q: "What is the name of the bathhouse in 'Spirited Away'?",
      a: "the Aburaya bathhouse",
    },
    {
      q: "In 'The Prestige', what is Borden's secret?",
      a: "he has an identical twin",
    },
    {
      q: "What does Forrest Gump's mom say life is like?",
      a: "a box of chocolates",
    },
    {
      q: "In 'The Dark Knight', what does the Joker use to escape from the police station?",
      a: "a cell phone bomb hidden in a prisoner",
    },
    {
      q: "What is the first rule of Fight Club?",
      a: "you do not talk about Fight Club",
    },
    {
      q: "In 'Goodfellas', what does Henry Hill say is the best thing about being a gangster?",
      a: "never having to wait in line",
    },
    {
      q: "What does Michael Corleone whisper to Fredo in 'The Godfather Part II'?",
      a: "I know it was you, Fredo",
    },
    {
      q: "In 'Mad Max: Fury Road', what do the War Boys spray on their mouths?",
      a: "chrome spray paint",
    },
  ];

  for (const prompt of trickyMoviePrompts) {
    await storage.createPrompt({
      deckId: movieBluffDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  console.log(`✅ Added ${trickyMoviePrompts.length} improved Movie Bluff prompts`);
}
