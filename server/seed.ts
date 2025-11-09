import { storage } from "./storage";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  // Create categories
  const classicCategory = await storage.createDeckCategory({
    name: "Classic",
    description: "Classic word and movie prompts",
    icon: "🎭",
  });

  const countryCategory = await storage.createDeckCategory({
    name: "Country",
    description: "Country-specific cultural prompts",
    icon: "🌍",
  });

  const gameCategory = await storage.createDeckCategory({
    name: "Games",
    description: "Video game themed prompts",
    icon: "🎮",
  });

  const moviesCategory = await storage.createDeckCategory({
    name: "Movies",
    description: "Film and cinema trivia",
    icon: "🎬",
  });

  const musicCategory = await storage.createDeckCategory({
    name: "Music",
    description: "Music and artists trivia",
    icon: "🎵",
  });

  const sportsCategory = await storage.createDeckCategory({
    name: "Sports",
    description: "Sports and athletes trivia",
    icon: "⚽",
  });

  const scienceCategory = await storage.createDeckCategory({
    name: "Science",
    description: "Science facts and discoveries",
    icon: "🔬",
  });

  // Create decks
  const wordUpDeck = await storage.createDeck({
    categoryId: classicCategory.id,
    name: "Word Up",
    description: "Weird word definitions",
    familySafe: true,
    locale: "en",
  });

  const movieBluffDeck = await storage.createDeck({
    categoryId: classicCategory.id,
    name: "Movie Bluff",
    description: "Fake movie plots",
    familySafe: true,
    locale: "en",
  });

  const indiaDeck = await storage.createDeck({
    categoryId: countryCategory.id,
    name: "India",
    description: "Indian culture and trivia",
    familySafe: true,
    locale: "en",
  });

  const usaDeck = await storage.createDeck({
    categoryId: countryCategory.id,
    name: "USA",
    description: "American culture and trivia",
    familySafe: true,
    locale: "en",
  });

  const brawlStarsDeck = await storage.createDeck({
    categoryId: gameCategory.id,
    name: "Brawl Stars",
    description: "Brawl Stars game trivia",
    familySafe: true,
    locale: "en",
  });

  const movieManiaDeck = await storage.createDeck({
    categoryId: moviesCategory.id,
    name: "Movie Mania",
    description: "Famous movies and actors",
    familySafe: true,
    locale: "en",
  });

  const musicTriviaDeck = await storage.createDeck({
    categoryId: musicCategory.id,
    name: "Music Trivia",
    description: "Songs, artists, and music history",
    familySafe: true,
    locale: "en",
  });

  const sportsFanDeck = await storage.createDeck({
    categoryId: sportsCategory.id,
    name: "Sports Fan",
    description: "Sports, teams, and athletes",
    familySafe: true,
    locale: "en",
  });

  const scienceFactsDeck = await storage.createDeck({
    categoryId: scienceCategory.id,
    name: "Science Facts",
    description: "Scientific discoveries and concepts",
    familySafe: true,
    locale: "en",
  });

  // Seed prompts for Word Up
  const wordUpPrompts = [
    { q: "What does 'petrichor' mean?", a: "The smell of rain on dry earth" },
    { q: "What is a 'defenestration'?", a: "The act of throwing someone out of a window" },
    { q: "What does 'callipygian' describe?", a: "Having well-shaped buttocks" },
    { q: "What is 'tmesis'?", a: "Inserting a word into another word" },
    { q: "What does 'snollygoster' mean?", a: "A shrewd, unprincipled person" },
    { q: "What is 'floccinaucinihilipilification'?", a: "The act of describing something as worthless" },
    { q: "What does 'borborygmus' refer to?", a: "Stomach rumbling" },
    { q: "What is a 'widdershins'?", a: "In a direction contrary to the sun's course" },
    { q: "What does 'taradiddle' mean?", a: "A small lie or pretentious nonsense" },
    { q: "What is 'mumpsimus'?", a: "Adhering to old ways despite evidence they are wrong" },
    { q: "What does 'gobemouche' describe?", a: "A person who believes everything they hear" },
    { q: "What is 'collywobbles'?", a: "Stomach pain or nervousness" },
    { q: "What does 'diphthong' mean?", a: "A sound formed by combining two vowels" },
    { q: "What is 'erinaceous'?", a: "Resembling or relating to a hedgehog" },
    { q: "What does 'gardyloo' warn of?", a: "Waste water about to be thrown from a window" },
    { q: "What is 'nudiustertian'?", a: "Relating to the day before yesterday" },
    { q: "What does 'absquatulate' mean?", a: "To leave abruptly" },
    { q: "What is 'yarborough'?", a: "A hand of cards with no card above a nine" },
    { q: "What does 'quomodocunquizing' describe?", a: "Making money in any way possible" },
    { q: "What is 'kakorrhaphiophobia'?", a: "Fear of failure" },
  ];

  for (const prompt of wordUpPrompts) {
    await storage.createPrompt({
      deckId: wordUpDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Movie Bluff
  const moviePrompts = [
    { q: "What is the plot of 'The Shawshank Redemption'?", a: "Two imprisoned men bond over years, finding redemption through compassion" },
    { q: "What happens in 'Inception'?", a: "A thief who steals secrets through dreams is offered a chance to erase his past" },
    { q: "Describe the story of 'Parasite'.", a: "A poor family schemes to become employees of a wealthy household" },
    { q: "What is 'The Matrix' about?", a: "A hacker discovers reality is a simulation and joins a rebellion" },
    { q: "Summarize 'Pulp Fiction'.", a: "Various criminals' lives intersect in unexpected ways in Los Angeles" },
    { q: "What happens in 'The Dark Knight'?", a: "Batman faces the Joker's chaos in Gotham City" },
    { q: "What is 'Forrest Gump' about?", a: "A simple man witnesses and influences major historical events" },
    { q: "Describe 'The Godfather'.", a: "The aging patriarch of a crime family transfers control to his reluctant son" },
    { q: "What is the plot of 'Interstellar'?", a: "Astronauts travel through a wormhole seeking a new home for humanity" },
    { q: "What happens in 'Fight Club'?", a: "An insomniac office worker forms an underground fight club" },
    { q: "Summarize 'Goodfellas'.", a: "The rise and fall of a mob associate over three decades" },
    { q: "What is 'The Prestige' about?", a: "Two magicians engage in a bitter rivalry with dire consequences" },
    { q: "Describe 'Eternal Sunshine of the Spotless Mind'.", a: "A couple undergoes a procedure to erase each other from their memories" },
    { q: "What happens in 'Spirited Away'?", a: "A girl works in a bathhouse for spirits to save her parents" },
    { q: "What is 'Whiplash' about?", a: "A young drummer faces a brutal music instructor's methods" },
    { q: "Summarize 'The Grand Budapest Hotel'.", a: "A concierge and lobby boy become embroiled in art theft and murder" },
    { q: "What is the plot of 'Mad Max: Fury Road'?", a: "A woman rebels against a tyrant in a post-apocalyptic wasteland" },
    { q: "Describe 'Her'.", a: "A man develops a relationship with an AI operating system" },
    { q: "What happens in 'Get Out'?", a: "A Black man uncovers disturbing secrets at his girlfriend's family estate" },
    { q: "What is 'Arrival' about?", a: "A linguist communicates with aliens to prevent global war" },
  ];

  for (const prompt of moviePrompts) {
    await storage.createPrompt({
      deckId: movieBluffDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for India
  const indiaPrompts = [
    { q: "What is 'jugaad'?", a: "An innovative fix or workaround using limited resources" },
    { q: "What does 'kal' mean in Hindi?", a: "Both yesterday and tomorrow" },
    { q: "What is 'chai pe charcha'?", a: "Informal discussion over tea" },
    { q: "What is a 'dabbawala'?", a: "A lunch box delivery person in Mumbai" },
    { q: "What does 'achcha' express?", a: "Okay, good, or understanding (context dependent)" },
    { q: "What is 'Bollywood'?", a: "The Hindi-language film industry based in Mumbai" },
    { q: "What is 'namaste'?", a: "A respectful greeting meaning 'I bow to you'" },
    { q: "What is 'holi'?", a: "The festival of colors celebrating spring" },
    { q: "What is a 'thali'?", a: "A platter with various dishes served together" },
    { q: "What is 'rangoli'?", a: "Colorful patterns made on floors for festivals" },
    { q: "What does 'arrey' express?", a: "An exclamation of surprise or calling attention" },
    { q: "What is 'cricket' in India?", a: "The most popular sport, almost a religion" },
    { q: "What is 'masala chai'?", a: "Spiced tea with milk" },
    { q: "What is a 'rickshaw'?", a: "A three-wheeled vehicle for short trips" },
    { q: "What is 'Diwali'?", a: "The festival of lights celebrating good over evil" },
    { q: "What does 'timepass' mean?", a: "Casual activity to pass time" },
    { q: "What is 'paneer'?", a: "Indian cottage cheese" },
    { q: "What is a 'mandap'?", a: "A decorated canopy for wedding ceremonies" },
    { q: "What is 'jhadu'?", a: "A traditional broom" },
    { q: "What does 'baap re baap' express?", a: "Oh my God! (expression of shock)" },
  ];

  for (const prompt of indiaPrompts) {
    await storage.createPrompt({
      deckId: indiaDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for USA
  const usaPrompts = [
    { q: "What is a 'homerun'?", a: "A baseball hit that allows the batter to circle all bases and score" },
    { q: "What is 'Thanksgiving'?", a: "A November holiday celebrating harvest and gratitude" },
    { q: "What is a 'Super Bowl'?", a: "The championship game of the NFL" },
    { q: "What does 'the American Dream' mean?", a: "The belief that anyone can succeed through hard work" },
    { q: "What is a 'food truck'?", a: "A mobile kitchen selling street food" },
    { q: "What is '4th of July'?", a: "Independence Day celebrating freedom from Britain" },
    { q: "What is 'tipping culture'?", a: "Giving extra money for service, typically 15-20%" },
    { q: "What is 'Black Friday'?", a: "The shopping day after Thanksgiving with major sales" },
    { q: "What is a 'tailgate party'?", a: "Pre-game gathering in stadium parking lots" },
    { q: "What is 'Route 66'?", a: "Historic highway from Chicago to Los Angeles" },
    { q: "What is a 'county fair'?", a: "A local festival with rides, games, and agricultural exhibits" },
    { q: "What is 'spring break'?", a: "A week-long vacation for students in March/April" },
    { q: "What is the 'Pledge of Allegiance'?", a: "A patriotic oath to the American flag" },
    { q: "What is a 'potluck'?", a: "A gathering where each person brings a dish to share" },
    { q: "What is 'jaywalking'?", a: "Crossing the street illegally or carelessly" },
    { q: "What is a 'mall'?", a: "A large indoor shopping center" },
    { q: "What is 'small talk'?", a: "Casual conversation about unimportant topics" },
    { q: "What is a 'yard sale'?", a: "Selling used items from your home's front yard" },
    { q: "What is 'sweet sixteen'?", a: "A big birthday celebration for 16-year-olds" },
    { q: "What is 'trick-or-treating'?", a: "Going door-to-door for candy on Halloween" },
  ];

  for (const prompt of usaPrompts) {
    await storage.createPrompt({
      deckId: usaDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Brawl Stars
  const brawlStarsPrompts = [
    { q: "What is Brawl Stars?", a: "A fast-paced multiplayer mobile game by Supercell" },
    { q: "What is a 'Brawler'?", a: "A playable character in Brawl Stars" },
    { q: "What is 'Gem Grab' mode?", a: "A game mode where teams collect gems from the center" },
    { q: "What is a 'Super' ability?", a: "A powerful special attack charged by dealing damage" },
    { q: "What is 'Power League'?", a: "The ranked competitive mode in Brawl Stars" },
    { q: "What is 'Showdown'?", a: "A battle royale mode where last brawler standing wins" },
    { q: "What are 'Star Powers'?", a: "Special passive abilities unlocked at max level" },
    { q: "What is 'Brawl Pass'?", a: "A seasonal progression system with exclusive rewards" },
    { q: "What is 'Heist' mode?", a: "A mode where teams try to destroy the enemy safe" },
    { q: "What are 'Gadgets'?", a: "Activated abilities with limited uses per match" },
    { q: "Who is 'Shelly'?", a: "The first brawler every player receives" },
    { q: "What is 'Bounty' mode?", a: "A mode where defeating enemies earns stars for your team" },
    { q: "What is a 'Bush'?", a: "Grass that hides brawlers from enemy sight" },
    { q: "What is 'Brawl Ball'?", a: "A soccer-style mode where teams try to score goals" },
    { q: "What are 'Chromatic Brawlers'?", a: "Brawlers that change rarity over seasons" },
    { q: "What is 'Siege' mode?", a: "A mode where teams build a robot to attack the enemy base" },
    { q: "What is 'Club League'?", a: "A competitive mode where clubs compete for rankings" },
    { q: "What are 'Hypercharges'?", a: "Ultimate abilities that enhance Super attacks" },
    { q: "What is a 'Mythic Brawler'?", a: "A rare tier of brawler, harder to unlock" },
    { q: "What is 'Knockout' mode?", a: "A 3v3 elimination mode with multiple rounds" },
  ];

  for (const prompt of brawlStarsPrompts) {
    await storage.createPrompt({
      deckId: brawlStarsDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Movie Mania
  const movieManiaPrompts = [
    { q: "Who directed the dinosaur theme park thriller 'Jurassic Park'?", a: "Steven Spielberg, the legendary director" },
    { q: "What James Cameron film about a doomed ship came out in the late 90s?", a: "Titanic premiered in 1997 and became a cultural phenomenon" },
    { q: "Which actor brought Tony Stark to life in the Marvel movies?", a: "Robert Downey Jr. redefined the character across multiple films" },
    { q: "What blue alien film holds the box office record worldwide?", a: "Avatar by James Cameron remains the highest-grossing film" },
    { q: "Who directed the iconic mafia trilogy starting with 'The Godfather'?", a: "Francis Ford Coppola created the masterpiece crime saga" },
    { q: "What groundbreaking animated film launched Pixar's success?", a: "Toy Story in 1995 revolutionized computer animation" },
    { q: "Which heartthrob played the artist who dies in 'Titanic'?", a: "Leonardo DiCaprio portrayed Jack Dawson in the romance" },
    { q: "What South Korean film made history at the 2020 Oscars?", a: "Parasite became the first foreign language Best Picture winner" },
    { q: "Who created the legendary orchestral scores for 'Star Wars'?", a: "John Williams composed the iconic themes and music" },
    { q: "What was the Sith Lord's identity before becoming evil?", a: "Anakin Skywalker was his name as a Jedi Knight" },
    { q: "Which method actor tragically died after playing the Joker?", a: "Heath Ledger passed away after his performance in The Dark Knight" },
    { q: "When did Harry Potter's magical journey begin on screen?", a: "The first film premiered in 2001 to massive worldwide success" },
    { q: "Who directed the dream-within-a-dream heist film 'Inception'?", a: "Christopher Nolan crafted the mind-bending thriller" },
    { q: "What's the name of the young lion prince in Disney's savanna epic?", a: "Simba grows from cub to king in The Lion King" },
    { q: "Which British actress portrayed the brightest witch at Hogwarts?", a: "Emma Watson brought Hermione Granger to life throughout the series" },
    { q: "What sci-fi franchise popularized the phrase 'May the Force be with you'?", a: "Star Wars introduced the iconic Jedi blessing to pop culture" },
    { q: "Who directed the non-linear crime stories in 'Pulp Fiction'?", a: "Quentin Tarantino revolutionized storytelling with his 1994 masterpiece" },
    { q: "What's the civilian identity of the web-slinging Marvel hero?", a: "Peter Parker is the nerdy photographer behind the Spider-Man mask" },
    { q: "Which beloved actor ran across America in 'Forrest Gump'?", a: "Tom Hanks portrayed the simple man who influenced history" },
    { q: "When did the Wachowskis release their reality-bending thriller?", a: "The Matrix arrived in 1999 and redefined action cinema" },
    { q: "Who directed the space opera that launched a merchandising empire?", a: "George Lucas created Star Wars and changed Hollywood forever" },
    { q: "What was the first feature film with fully synchronized sound?", a: "The Jazz Singer in 1927 marked the end of silent cinema" },
    { q: "Which director is known for elaborate one-take action sequences?", a: "Sam Mendes created the illusion of a single shot in 1917" },
    { q: "What Spielberg film shows aliens making peaceful contact?", a: "E.T. the Extra-Terrestrial became a heartwarming family classic" },
    { q: "Which 1994 prison drama tops IMDb's all-time rankings?", a: "The Shawshank Redemption about hope and friendship in prison" },
    { q: "Who played the reluctant wizard mentor in Harry Potter?", a: "Richard Harris and later Michael Gambon portrayed Dumbledore" },
    { q: "What Christopher Nolan film features competing magicians?", a: "The Prestige explores rivalry and obsession between illusionists" },
    { q: "Which Marvel film brought dozens of superheroes together?", a: "Avengers: Endgame concluded the Infinity Saga with massive scale" },
    { q: "Who directed the black and white silent film 'The Artist'?", a: "Michel Hazanavicius won Best Director for the 2011 homage" },
    { q: "What Tarantino film is set mostly in a single room?", a: "The Hateful Eight takes place in a snowbound Wyoming cabin" },
    { q: "Which film franchise features a British spy with a license to kill?", a: "James Bond has appeared in over 25 films since 1962" },
    { q: "Who directed the surreal dreamscape thriller 'Mulholland Drive'?", a: "David Lynch created the mysterious Hollywood noir masterpiece" },
    { q: "What was Pixar's first sequel film?", a: "Toy Story 2 continued the adventures of Woody and Buzz" },
    { q: "Which director is famous for long tracking shots and symmetry?", a: "Wes Anderson's distinctive visual style defines his quirky films" },
    { q: "What 2019 Korean film won the Palme d'Or at Cannes?", a: "Parasite achieved global acclaim before Oscar success" },
    { q: "Who played the iconic boxer in all six Rocky films?", a: "Sylvester Stallone wrote and starred as Rocky Balboa" },
    { q: "What Hitchcock film features the infamous shower scene?", a: "Psycho revolutionized horror with its shocking twist and violence" },
    { q: "Which actress won an Oscar for playing a mute custodian?", a: "Sally Hawkins starred in The Shape of Water's fantasy romance" },
    { q: "What Spielberg film depicts the D-Day invasion graphically?", a: "Saving Private Ryan opens with brutal Normandy beach warfare" },
    { q: "Who directed the dystopian children's fantasy 'Pan's Labyrinth'?", a: "Guillermo del Toro blended Spanish Civil War with dark fairy tales" },
    { q: "What was the first animated film nominated for Best Picture?", a: "Beauty and the Beast earned the historic 1992 nomination" },
    { q: "Which director made 'Oldboy' and 'The Handmaiden'?", a: "Park Chan-wook crafts provocative South Korean psychological thrillers" },
    { q: "What's the name of the computer in '2001: A Space Odyssey'?", a: "HAL 9000 is the sentient AI that malfunctions during the mission" },
    { q: "Who directed the epic World War I film shot to look like one take?", a: "Sam Mendes coordinated the technical achievement of 1917" },
    { q: "What Pixar film explores emotions inside a young girl's mind?", a: "Inside Out personifies Joy, Sadness, and other feelings" },
    { q: "Which filmmaker directed both 'Jaws' and 'Schindler's List'?", a: "Steven Spielberg mastered both blockbusters and serious dramas" },
    { q: "What 1975 musical satire features a 'Time Warp' dance?", a: "The Rocky Horror Picture Show became a cult midnight movie" },
    { q: "Who directed the surreal horror comedy 'Get Out'?", a: "Jordan Peele's directorial debut tackled race through genre filmmaking" },
    { q: "What was the first Marvel Cinematic Universe film released?", a: "Iron Man in 2008 launched the interconnected superhero franchise" },
    { q: "Which Japanese animator co-founded Studio Ghibli?", a: "Hayao Miyazaki created masterpieces like Spirited Away and Totoro" },
  ];

  for (const prompt of movieManiaPrompts) {
    await storage.createPrompt({
      deckId: movieManiaDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Music Trivia
  const musicTriviaPrompts = [
    { q: "Which legendary performer earned the title 'King of Pop'?", a: "Michael Jackson revolutionized music videos and pop culture worldwide" },
    { q: "What iconic rock band featured Freddie Mercury's powerful vocals?", a: "Queen dominated stadiums with anthems like Bohemian Rhapsody" },
    { q: "Who released the heartbreak anthem 'Rolling in the Deep'?", a: "Adele's powerful voice made it a global phenomenon" },
    { q: "When did the Fab Four officially split up?", a: "The Beatles disbanded in 1970 after a decade of dominance" },
    { q: "Which two Latin superstars headlined the 2020 Super Bowl?", a: "Shakira and Jennifer Lopez delivered an electrifying halftime performance" },
    { q: "What was Elvis Presley's rarely-used middle name?", a: "Aaron was the middle name of the King of Rock and Roll" },
    { q: "Who holds the record as the top-selling female artist ever?", a: "Madonna sold over 300 million records throughout her career" },
    { q: "What classical instrument does rapper Lizzo skillfully play?", a: "The flute is her signature instrument from her classical training" },
    { q: "Which British rock band created the operatic masterpiece 'Bohemian Rhapsody'?", a: "Queen's six-minute epic became one of rock's greatest achievements" },
    { q: "What was the title of Taylor Swift's self-titled debut album?", a: "Taylor Swift launched her career with country-pop songs in 2006" },
    { q: "Who composed the baroque violin concertos 'The Four Seasons'?", a: "Antonio Vivaldi wrote the masterpiece in the early 1700s" },
    { q: "When did the streaming giant Spotify first launch?", a: "Spotify revolutionized music streaming when it debuted in 2008" },
    { q: "Who sang the controversial religious-themed hit 'Like a Prayer'?", a: "Madonna sparked debate with the provocative 1989 single" },
    { q: "What wildly popular boy band featured Harry Styles?", a: "One Direction formed on X Factor and dominated pop charts" },
    { q: "Which vocalist earned the legendary title 'Queen of Soul'?", a: "Aretha Franklin's incredible voice defined soul music for generations" },
    { q: "What was the debut single from K-pop sensation BTS?", a: "No More Dream launched their career in 2013" },
    { q: "Who created the zombie dance phenomenon with 'Thriller'?", a: "Michael Jackson's 14-minute music video revolutionized the medium" },
    { q: "What string instrument is Yo-Yo Ma world-famous for playing?", a: "The cello is his instrument as one of the greatest classical musicians" },
    { q: "Who performed the title track from the film 'Purple Rain'?", a: "Prince both starred in and created the soundtrack for the movie" },
    { q: "What Andrew Lloyd Webber musical has the longest Broadway run?", a: "The Phantom of the Opera ran for over 30 years straight" },
    { q: "Which band's album cover features a baby swimming toward a dollar bill?", a: "Nirvana's Nevermind became grunge's most iconic image in 1991" },
    { q: "Who composed the classical piece 'Für Elise'?", a: "Ludwig van Beethoven wrote the beloved piano bagatelle" },
    { q: "What groundbreaking music video channel launched in 1981?", a: "MTV started with 'Video Killed the Radio Star' as its first video" },
    { q: "Which female rapper made history as the first to win Best Rap Album?", a: "Cardi B won the Grammy for Invasion of Privacy in 2019" },
    { q: "What Fleetwood Mac album explores the band's romantic breakups?", a: "Rumours became one of the best-selling albums despite internal drama" },
    { q: "Who wrote and performed 'Lose Yourself' for the film 8 Mile?", a: "Eminem won an Oscar for the motivational rap anthem" },
    { q: "What jazz legend was nicknamed 'Satchmo' and 'Pops'?", a: "Louis Armstrong revolutionized jazz with his trumpet and gravelly voice" },
    { q: "Which boy band declared they wanted it 'that way'?", a: "Backstreet Boys dominated late 90s pop with the massive hit" },
    { q: "Who is the best-selling solo artist in music history?", a: "Elvis Presley sold over 500 million records as the King" },
    { q: "What Pink Floyd album features a prism on the cover?", a: "The Dark Side of the Moon became a progressive rock masterpiece" },
    { q: "Which country star has a theme park in Tennessee?", a: "Dolly Parton owns Dollywood in the Smoky Mountains" },
    { q: "Who performed the iconic guitar solo in 'Stairway to Heaven'?", a: "Jimmy Page of Led Zeppelin created rock's most famous solo" },
    { q: "What hip-hop artist's real name is Marshall Mathers?", a: "Eminem became the best-selling rapper under his stage name" },
    { q: "Which classical composer continued creating despite going deaf?", a: "Ludwig van Beethoven wrote his greatest works while losing his hearing" },
    { q: "Who sang the James Bond theme 'Skyfall'?", a: "Adele won an Oscar and Grammy for the 2012 theme song" },
    { q: "What Motown group featured Diana Ross as lead singer?", a: "The Supremes were the most successful act of the 1960s" },
    { q: "Which guitar legend played left-handed and upside down?", a: "Jimi Hendrix revolutionized electric guitar despite unconventional technique" },
    { q: "Who holds the record for most Grammy wins ever?", a: "Beyoncé surpassed all artists with over 30 Grammy awards" },
    { q: "What British punk band sang 'God Save the Queen'?", a: "Sex Pistols shocked Britain with the controversial 1977 anthem" },
    { q: "Which rapper interrupted Taylor Swift's 2009 VMA speech?", a: "Kanye West created an infamous moment defending Beyoncé" },
    { q: "What instrument did jazz legend Miles Davis masterfully play?", a: "The trumpet was his weapon of choice throughout his career" },
    { q: "Who composed the opera 'The Magic Flute'?", a: "Wolfgang Amadeus Mozart wrote the singspiel in his final year" },
    { q: "Which reggae legend spread messages of peace and unity?", a: "Bob Marley became Jamaica's most famous musical export worldwide" },
    { q: "What rock band sang about a 'Stairway to Heaven'?", a: "Led Zeppelin created the eight-minute epic rock ballad" },
    { q: "Who was the first woman inducted into the Rock Hall of Fame?", a: "Aretha Franklin earned the honor in 1987 for her soul legacy" },
    { q: "What EDM DJ topped Forbes' highest-paid musician list?", a: "Calvin Harris dominated electronic dance music and festival headlining" },
    { q: "Which soprano became one of opera's most celebrated voices?", a: "Maria Callas defined dramatic opera performance in the 20th century" },
    { q: "Who created the concept album 'The Wall'?", a: "Pink Floyd built a rock opera about isolation and alienation" },
    { q: "What country legend wrote 'I Will Always Love You'?", a: "Dolly Parton penned it before Whitney Houston's famous cover" },
    { q: "Which rapper's real name is Shawn Carter?", a: "Jay-Z built a hip-hop empire from Brooklyn to billionaire status" },
  ];

  for (const prompt of musicTriviaPrompts) {
    await storage.createPrompt({
      deckId: musicTriviaDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Sports Fan
  const sportsFanPrompts = [
    { q: "How many players take the field for each soccer team?", a: "Eleven players including the goalkeeper defend and attack" },
    { q: "Which racquet sport made Serena Williams a legend?", a: "Tennis courts became her domain with 23 Grand Slam titles" },
    { q: "What's the point value when a football team crosses the goal line?", a: "A touchdown is worth six points before the extra point" },
    { q: "Which European nation won the 2018 FIFA World Cup in Russia?", a: "France claimed their second World Cup title defeating Croatia" },
    { q: "How many interlocking circles appear on the Olympic flag?", a: "Five rings represent the continents united through sport" },
    { q: "What's the inside diameter measurement of a regulation basketball rim?", a: "Eighteen inches is the standard width from edge to edge" },
    { q: "Which NBA legend accumulated the most championship rings?", a: "Bill Russell won an incredible eleven championships with the Celtics" },
    { q: "What racquet sport involves hitting a feathered projectile?", a: "Badminton players volley the shuttlecock across a high net" },
    { q: "What's the official distance of a marathon race?", a: "Exactly 26.2 miles based on the ancient Greek legend" },
    { q: "Which South American country hosted the 2016 Summer Olympics?", a: "Brazil welcomed the world to Rio de Janeiro's first Olympics" },
    { q: "What boxer famously declared himself 'The Greatest'?", a: "Muhammad Ali backed up his bold claim with skill and charisma" },
    { q: "How many major tennis tournaments make up the Grand Slam?", a: "Four prestigious tournaments including Wimbledon and the US Open" },
    { q: "What unusual sport was played during the Apollo moon missions?", a: "Golf was famously demonstrated by Alan Shepard on the lunar surface" },
    { q: "What color marks the bullseye in Olympic archery targets?", a: "Gold or yellow indicates the highest-scoring center ring" },
    { q: "How many bases form the diamond in baseball?", a: "Four bases create the path from home plate and back" },
    { q: "What prestigious golf tournament happens every April in Augusta?", a: "The Masters awards the famous green jacket to its champion" },
    { q: "Which swimmer holds the all-time Olympic gold medal record?", a: "Michael Phelps captured an astounding 23 gold medals across multiple Games" },
    { q: "What traditional martial art is considered Japan's national sport?", a: "Sumo wrestling combines ancient ritual with athletic combat" },
    { q: "How many twenty-minute periods make up a hockey game?", a: "Three periods of intense action with two intermissions between" },
    { q: "When were women first allowed to compete in Olympic events?", a: "The 1900 Paris Games marked the debut of female athletes" },
    { q: "What perfect score is sought in bowling's ten frames?", a: "Three hundred points represents twelve consecutive strikes" },
    { q: "Which country dominates Olympic medal counts in cricket?", a: "Cricket appeared only once in 1900 when Great Britain won gold" },
    { q: "How many players form an American football team on the field?", a: "Eleven players per side battle in offense and defense" },
    { q: "What championship trophy is awarded in the NHL playoffs?", a: "The Stanley Cup is the oldest professional sports trophy" },
    { q: "Which female gymnast scored the first perfect ten?", a: "Nadia Comaneci achieved the feat at the 1976 Montreal Olympics" },
    { q: "How many points is a field goal worth in basketball?", a: "Three points are awarded for shots beyond the arc" },
    { q: "What golf term means one stroke under par?", a: "A birdie is the standard goal for skilled players on each hole" },
    { q: "Which athlete broke the four-minute mile barrier first?", a: "Roger Bannister achieved the historic feat in 1954" },
    { q: "How many rounds make up a professional boxing championship?", a: "Twelve three-minute rounds determine the title in modern boxing" },
    { q: "What sport features a scrum and a try?", a: "Rugby union combines brutal forward play with strategic backline attacks" },
    { q: "Which country invented the sport of basketball?", a: "The United States created the game in Massachusetts in 1891" },
    { q: "How many players form a complete volleyball team?", a: "Six players rotate through positions on each side of the net" },
    { q: "What distance do Olympic sprint swimmers race in the pool?", a: "Fifty meters represents the shortest and fastest freestyle event" },
    { q: "Which tennis surface is Wimbledon famous for using?", a: "Grass courts provide the traditional and fastest playing surface" },
    { q: "How many clubs can a golfer carry in tournament play?", a: "Fourteen clubs is the maximum allowed under official rules" },
    { q: "What's the maximum break possible in snooker?", a: "One hundred forty-seven points requires pocketing all balls perfectly" },
    { q: "Which nation has won the most FIFA World Cups?", a: "Brazil leads with five tournament victories spanning decades" },
    { q: "How many innings make up a regulation baseball game?", a: "Nine innings allow each team to bat and field equally" },
    { q: "What sport crowns champions at Flushing Meadows?", a: "The US Open tennis tournament concludes the Grand Slam season" },
    { q: "Which motorsport features the Monaco Grand Prix?", a: "Formula One racing showcases speed through the narrow city streets" },
    { q: "How many players start on the court in basketball?", a: "Five players per team including guards, forwards, and a center" },
    { q: "What winter sport combines skiing and rifle shooting?", a: "Biathlon tests endurance and precision in a unique Olympic event" },
    { q: "Which boxer had the famous 'Rumble in the Jungle' fight?", a: "Muhammad Ali defeated George Foreman in Zaire in 1974" },
    { q: "How many majors did Tiger Woods win during his career?", a: "Fifteen major championships place him second in golf history" },
    { q: "What sport awards the Vince Lombardi Trophy?", a: "The Super Bowl champion takes home the NFL's ultimate prize" },
    { q: "Which athlete is known as 'His Airness'?", a: "Michael Jordan earned the nickname for his gravity-defying dunks" },
    { q: "How many games must you win to claim a tennis set?", a: "Six games with a two-game advantage secures the set" },
    { q: "What track event is exactly one lap around?", a: "The four hundred meter dash circles the track once at full speed" },
    { q: "Which sport features a pommel horse and parallel bars?", a: "Men's artistic gymnastics tests strength and grace on apparatus" },
    { q: "How many minutes are in each half of a soccer match?", a: "Forty-five minutes plus stoppage time makes each half" },
  ];

  for (const prompt of sportsFanPrompts) {
    await storage.createPrompt({
      deckId: sportsFanDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  // Seed prompts for Science Facts
  const scienceFactsPrompts = [
    { q: "What two-letter symbol represents gold on the periodic table?", a: "Au comes from the Latin word aurum for the precious metal" },
    { q: "Which rocky planet orbits closest to our Sun?", a: "Mercury speeds around the star faster than any other planet" },
    { q: "How many individual bones form the adult human skeleton?", a: "Two hundred six bones support and protect our body" },
    { q: "What's the universal speed limit in physics?", a: "Light travels at exactly 299,792,458 meters per second in a vacuum" },
    { q: "What atmospheric gas do plants breathe in during photosynthesis?", a: "Carbon dioxide is absorbed through stomata in the leaves" },
    { q: "Which physicist revolutionized our understanding of space and time?", a: "Albert Einstein developed both special and general relativity" },
    { q: "What's the body's largest organ by surface area?", a: "Skin protects us and covers about 20 square feet" },
    { q: "What's the basic building block of all living organisms?", a: "The cell is the fundamental unit of life" },
    { q: "How many planets orbit our Sun after Pluto's demotion?", a: "Eight planets remain from Mercury to Neptune" },
    { q: "What common molecule is written as H2O?", a: "Water consists of two hydrogen atoms bonded to oxygen" },
    { q: "What invisible force pulls objects toward Earth's center?", a: "Gravity keeps us anchored and makes things fall down" },
    { q: "What organelle generates energy for cellular functions?", a: "Mitochondria are often called the powerhouse of the cell" },
    { q: "What natural material ranks highest on the Mohs hardness scale?", a: "Diamond is the hardest naturally occurring substance known" },
    { q: "What type of reptile is the massive Komodo species?", a: "The Komodo dragon is the world's largest living lizard" },
    { q: "What scientific field studies atmospheric conditions and weather patterns?", a: "Meteorology forecasts everything from daily weather to climate change" },
    { q: "How many chromosomes contain human genetic information?", a: "Forty-six chromosomes arranged in 23 pairs carry our DNA" },
    { q: "Which gas giant is the most massive planet in our system?", a: "Jupiter contains more mass than all other planets combined" },
    { q: "At what temperature does pure water begin to boil?", a: "One hundred degrees Celsius at standard atmospheric pressure" },
    { q: "What element sits at position one on the periodic table?", a: "Hydrogen is the lightest and most abundant element" },
    { q: "What plant structures convert sunlight into chemical energy?", a: "Chloroplasts in the leaves perform photosynthesis to make food" },
    { q: "What subatomic particle carries a negative electrical charge?", a: "Electrons orbit the nucleus and determine chemical bonding" },
    { q: "Which planet is known for its prominent ring system?", a: "Saturn displays spectacular rings made of ice and rock particles" },
    { q: "What's the scientific name for the human species?", a: "Homo sapiens distinguishes modern humans from ancient ancestors" },
    { q: "What process converts liquid water into vapor?", a: "Evaporation occurs when molecules gain enough energy to escape" },
    { q: "Which blood type is considered the universal donor?", a: "O negative blood can be given to patients of any type" },
    { q: "What gas makes up most of Earth's atmosphere?", a: "Nitrogen comprises about 78 percent of the air we breathe" },
    { q: "What scientific law states every action has an equal reaction?", a: "Newton's Third Law of Motion describes action-reaction pairs" },
    { q: "What organ pumps blood throughout the human body?", a: "The heart beats about 100,000 times each day" },
    { q: "What phenomenon causes the sky to appear blue?", a: "Rayleigh scattering disperses shorter wavelengths of sunlight" },
    { q: "Which vitamin is produced when skin absorbs sunlight?", a: "Vitamin D synthesis requires ultraviolet B radiation exposure" },
    { q: "What's the largest land animal alive today?", a: "The African elephant can weigh up to seven tons" },
    { q: "What protective layer shields Earth from harmful solar radiation?", a: "The ozone layer in the stratosphere blocks ultraviolet rays" },
    { q: "What process do plants use to transport water upward?", a: "Transpiration and capillary action move water from roots to leaves" },
    { q: "Which scientist developed the theory of natural selection?", a: "Charles Darwin explained evolution through his groundbreaking work" },
    { q: "What causes the moon to appear illuminated at night?", a: "Reflected sunlight makes the moon visible from Earth" },
    { q: "What's the freezing point of water in Fahrenheit?", a: "Thirty-two degrees Fahrenheit marks the ice formation temperature" },
    { q: "What astronomical event happens when the moon blocks the sun?", a: "A solar eclipse casts a shadow across parts of Earth" },
    { q: "Which element is essential for all known forms of life?", a: "Carbon forms the backbone of all organic molecules" },
    { q: "What causes tides in Earth's oceans?", a: "The moon's gravitational pull creates regular tidal cycles" },
    { q: "What's the term for animals that are active at night?", a: "Nocturnal creatures sleep during day and hunt after dark" },
    { q: "Which layer of Earth contains the magnetic field generator?", a: "The outer core's molten iron creates our protective magnetosphere" },
    { q: "What process allows animals to maintain constant body temperature?", a: "Homeostasis regulates internal conditions despite external changes" },
    { q: "Which gas do humans exhale as a waste product?", a: "Carbon dioxide is removed from blood in the lungs" },
    { q: "What extinct reptiles dominated the Mesozoic Era?", a: "Dinosaurs ruled Earth for over 165 million years" },
    { q: "What's the smallest bone in the human body?", a: "The stapes in the middle ear measures just millimeters" },
    { q: "Which force opposes motion between surfaces in contact?", a: "Friction converts kinetic energy into heat through resistance" },
    { q: "What determines an element's position on the periodic table?", a: "The atomic number counts the protons in each nucleus" },
    { q: "Which mammal can truly fly using powered flight?", a: "Bats are the only mammals capable of sustained flight" },
    { q: "What term describes organisms that make their own food?", a: "Autotrophs or producers create energy through photosynthesis" },
    { q: "What percentage of Earth's surface is covered by water?", a: "About 71 percent of the planet is ocean and freshwater" },
  ];

  for (const prompt of scienceFactsPrompts) {
    await storage.createPrompt({
      deckId: scienceFactsDeck.id,
      questionText: prompt.q,
      correctAnswer: prompt.a,
      familySafe: true,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${wordUpPrompts.length} Word Up prompts`);
  console.log(`   - ${moviePrompts.length} Movie Bluff prompts`);
  console.log(`   - ${indiaPrompts.length} India prompts`);
  console.log(`   - ${usaPrompts.length} USA prompts`);
  console.log(`   - ${brawlStarsPrompts.length} Brawl Stars prompts`);
  console.log(`   - ${movieManiaPrompts.length} Movie Mania prompts (UPDATED)`);
  console.log(`   - ${musicTriviaPrompts.length} Music Trivia prompts (UPDATED)`);
  console.log(`   - ${sportsFanPrompts.length} Sports Fan prompts (UPDATED)`);
  console.log(`   - ${scienceFactsPrompts.length} Science Facts prompts (UPDATED)`);
  console.log(`\n🎯 Total prompts: ${wordUpPrompts.length + moviePrompts.length + indiaPrompts.length + usaPrompts.length + brawlStarsPrompts.length + movieManiaPrompts.length + musicTriviaPrompts.length + sportsFanPrompts.length + scienceFactsPrompts.length}`);
}
