import { storage } from "./storage";

export async function seedObscureQuestions() {
  console.log("🎬 Adding obscure movie and trivia questions...");

  const categories = await storage.getAllDeckCategories();
  const classicCategory = categories.find((c) => c.name === "Classic");
  
  if (!classicCategory) {
    console.log("Classic category not found, skipping");
    return;
  }

  const decks = await storage.getDecksByCategory(classicCategory.id);
  const movieBluffDeck = decks.find((d) => d.name === "Movie Bluff");
  const wordUpDeck = decks.find((d) => d.name === "Word Up");
  
  // Obscure cult classic movies that most people haven't heard of
  const obscureMoviePrompts = [
    {
      q: "What is 'Primer' (2004) about?",
      a: "Two engineers accidentally invent time travel in their garage",
    },
    {
      q: "In 'Coherence' (2013), what causes the strange events?",
      a: "A passing comet creates parallel realities that intersect",
    },
    {
      q: "What happens in 'The Man from Earth' (2007)?",
      a: "A professor reveals he's a 14,000-year-old caveman",
    },
    {
      q: "What is 'Triangle' (2009) about?",
      a: "A woman gets trapped in a time loop on an abandoned ship",
    },
    {
      q: "In 'Timecrimes' (2007), what does the protagonist do?",
      a: "Accidentally creates multiple versions of himself through time travel",
    },
    {
      q: "What is the plot of 'Moon' (2009)?",
      a: "A lunar miner discovers he's one of many clones",
    },
    {
      q: "In 'The Invitation' (2015), what is revealed at the dinner party?",
      a: "The hosts plan to murder their guests as part of a cult ritual",
    },
    {
      q: "What happens in 'Predestination' (2014)?",
      a: "A time agent discovers he is his own mother and father",
    },
    {
      q: "In 'The One I Love' (2014), what do the couple discover?",
      a: "The guest house contains perfect copies of themselves",
    },
    {
      q: "What is 'Upstream Color' (2013) about?",
      a: "People are controlled by parasitic worms and connected through pigs",
    },
    {
      q: "In 'Synecdoche, New York', what does the protagonist build?",
      a: "A life-size replica of New York City inside a warehouse",
    },
    {
      q: "What is 'Holy Motors' (2012) about?",
      a: "A man travels Paris in a limo performing mysterious appointments",
    },
    {
      q: "In 'Enter the Void' (2009), from whose perspective is the film shown?",
      a: "A dead drug dealer's soul floating above Tokyo",
    },
    {
      q: "What happens in 'The Fall' (2006)?",
      a: "A stuntman tells an elaborate fantasy story to a hospitalized girl",
    },
    {
      q: "In 'Waking Life' (2001), what is the protagonist unable to do?",
      a: "Wake up from a lucid dream state",
    },
    {
      q: "What is 'Rubber' (2010) about?",
      a: "A sentient tire that kills people with psychokinetic powers",
    },
    {
      q: "In 'The Fountain' (2006), how many timelines are shown?",
      a: "Three parallel stories across 1000 years",
    },
    {
      q: "What is 'Donnie Darko's' imaginary friend?",
      a: "A six-foot tall demonic rabbit named Frank",
    },
    {
      q: "In 'Mr. Nobody' (2009), what is the protagonist's situation?",
      a: "The last mortal human in 2092 recalling his possible lives",
    },
    {
      q: "What is 'The Lobster' (2015) about?",
      a: "Single people have 45 days to find love or be turned into animals",
    },
  ];

  if (movieBluffDeck) {
    for (const prompt of obscureMoviePrompts) {
      await storage.createPrompt({
        deckId: movieBluffDeck.id,
        questionText: prompt.q,
        correctAnswer: prompt.a,
        familySafe: true,
      });
    }
    console.log(`✅ Added ${obscureMoviePrompts.length} obscure movie prompts`);
  }

  // Obscure word definitions
  const obscureWordPrompts = [
    {
      q: "What does 'petrichor' mean?",
      a: "the smell of rain on dry earth",
    },
    {
      q: "What is a 'vomitory'?",
      a: "an entrance or exit in an amphitheater",
    },
    {
      q: "What does 'defenestration' mean?",
      a: "the act of throwing someone out of a window",
    },
    {
      q: "What is 'sonder'?",
      a: "realizing everyone has a life as complex as your own",
    },
    {
      q: "What does 'apricity' mean?",
      a: "the warmth of the sun in winter",
    },
    {
      q: "What is a 'quincunx'?",
      a: "an arrangement of five objects with four at corners and one in center",
    },
    {
      q: "What does 'tmesis' mean?",
      a: "inserting a word into another word (abso-bloody-lutely)",
    },
    {
      q: "What is 'aglet'?",
      a: "the plastic tip on a shoelace",
    },
    {
      q: "What does 'phosphenes' mean?",
      a: "the lights you see when you close your eyes and press on them",
    },
    {
      q: "What is a 'tittle'?",
      a: "the dot above the letter i or j",
    },
    {
      q: "What does 'mamihlapinatapai' mean?",
      a: "a wordless look between people who both want something but won't initiate",
    },
    {
      q: "What is 'eigengrau'?",
      a: "the dark gray color you see when you close your eyes",
    },
    {
      q: "What does 'interrobang' mean?",
      a: "a punctuation mark combining ? and !",
    },
    {
      q: "What is a 'ferrule'?",
      a: "the metal band on a pencil that holds the eraser",
    },
    {
      q: "What does 'lunula' mean?",
      a: "the white crescent at the base of your fingernail",
    },
    {
      q: "What is 'philtrum'?",
      a: "the groove between your nose and upper lip",
    },
    {
      q: "What does 'glabella' mean?",
      a: "the space between your eyebrows",
    },
    {
      q: "What is a 'mondegreen'?",
      a: "mishearing a phrase (like 'scuse me while I kiss this guy')",
    },
    {
      q: "What does 'saccade' mean?",
      a: "the rapid movement of your eyes between fixed points",
    },
    {
      q: "What is 'crepuscular'?",
      a: "relating to twilight or active during dawn and dusk",
    },
  ];

  if (wordUpDeck) {
    for (const prompt of obscureWordPrompts) {
      await storage.createPrompt({
        deckId: wordUpDeck.id,
        questionText: prompt.q,
        correctAnswer: prompt.a,
        familySafe: true,
      });
    }
    console.log(`✅ Added ${obscureWordPrompts.length} obscure word prompts`);
  }

  console.log("✅ Obscure questions added successfully!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedObscureQuestions().then(() => process.exit(0));
}
