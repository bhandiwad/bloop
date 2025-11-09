import { storage } from "./storage";

export async function seedPsychStyleQuestions() {
  console.log("🎭 Adding Bloop-style questions...");

  const categories = await storage.getAllDeckCategories();
  const classicCategory = categories.find((c) => c.name === "Classic");
  
  if (!classicCategory) {
    console.log("Classic category not found, skipping");
    return;
  }

  const bloopWordsDeck = await storage.createDeck({
    categoryId: classicCategory.id,
    name: "Bloop Words",
    description: "Obscure words with hilarious definitions",
    familySafe: true,
    locale: "en",
  });

  const bloopFactsDeck = await storage.createDeck({
    categoryId: classicCategory.id,
    name: "Bloop Facts",
    description: "Weird facts that sound made up",
    familySafe: true,
    locale: "en",
  });

  const wordPrompts = [
    {
      questionText: "What does 'bumfuzzle' mean?",
      correctAnswer: "to confuse or perplex someone",
    },
    {
      questionText: "What is a 'lollygag'?",
      correctAnswer: "to spend time aimlessly or waste time",
    },
    {
      questionText: "What does 'snickersnee' refer to?",
      correctAnswer: "a large knife used as a weapon",
    },
    {
      questionText: "What is 'gobbledygook'?",
      correctAnswer: "language that is meaningless or hard to understand",
    },
    {
      questionText: "What does 'flibbertigibbet' mean?",
      correctAnswer: "a frivolous or flighty person",
    },
    {
      questionText: "What is a 'whippersnapper'?",
      correctAnswer: "a young person who is overconfident or impertinent",
    },
    {
      questionText: "What does 'cattywampus' mean?",
      correctAnswer: "askew or not lined up correctly",
    },
    {
      questionText: "What is 'hullabaloo'?",
      correctAnswer: "a commotion or fuss about something",
    },
    {
      questionText: "What does 'brouhaha' mean?",
      correctAnswer: "an uproar or noisy confusion",
    },
    {
      questionText: "What is a 'kerfuffle'?",
      correctAnswer: "a fuss or commotion over something trivial",
    },
    {
      questionText: "What does 'bamboozle' mean?",
      correctAnswer: "to deceive or trick someone",
    },
    {
      questionText: "What is 'shenanigans'?",
      correctAnswer: "silly or mischievous behavior",
    },
    {
      questionText: "What does 'discombobulate' mean?",
      correctAnswer: "to confuse or disconcert someone",
    },
    {
      questionText: "What is a 'nincompoop'?",
      correctAnswer: "a foolish or stupid person",
    },
    {
      questionText: "What does 'hodgepodge' mean?",
      correctAnswer: "a confused mixture of different things",
    },
  ];

  const factPrompts = [
    {
      questionText: "What unusual ability do octopuses have?",
      correctAnswer: "they can taste with their arms",
    },
    {
      questionText: "What happens when you sneeze?",
      correctAnswer: "your heart skips a beat",
    },
    {
      questionText: "What's special about a shrimp's heart?",
      correctAnswer: "it's located in its head",
    },
    {
      questionText: "How do butterflies taste their food?",
      correctAnswer: "with their feet",
    },
    {
      questionText: "What can't a crocodile do with its tongue?",
      correctAnswer: "stick it out of its mouth",
    },
    {
      questionText: "What's unique about a flamingo's eating position?",
      correctAnswer: "it can only eat with its head upside down",
    },
    {
      questionText: "How long can a snail sleep?",
      correctAnswer: "up to three years",
    },
    {
      questionText: "What percentage of your body is water?",
      correctAnswer: "about 60 percent",
    },
    {
      questionText: "How many times does a hummingbird's heart beat per minute?",
      correctAnswer: "more than 1,200 times",
    },
    {
      questionText: "What's the only letter that doesn't appear in any US state name?",
      correctAnswer: "the letter Q",
    },
    {
      questionText: "How many bones does a baby have compared to an adult?",
      correctAnswer: "about 100 more bones",
    },
    {
      questionText: "What happens to your height during the day?",
      correctAnswer: "you shrink by about half an inch",
    },
    {
      questionText: "How fast do your fingernails grow?",
      correctAnswer: "about 3.5 millimeters per month",
    },
    {
      questionText: "What's the most common eye color in the world?",
      correctAnswer: "brown",
    },
    {
      questionText: "How many taste buds does your tongue have?",
      correctAnswer: "about 10,000",
    },
  ];

  for (const prompt of wordPrompts) {
    await storage.createPrompt({
      deckId: bloopWordsDeck.id,
      questionText: prompt.questionText,
      correctAnswer: prompt.correctAnswer,
      familySafe: true,
    });
  }

  for (const prompt of factPrompts) {
    await storage.createPrompt({
      deckId: bloopFactsDeck.id,
      questionText: prompt.questionText,
      correctAnswer: prompt.correctAnswer,
      familySafe: true,
    });
  }

  console.log(`✅ Added ${wordPrompts.length} Bloop Words prompts`);
  console.log(`✅ Added ${factPrompts.length} Bloop Facts prompts`);
}
