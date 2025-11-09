import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deck {
  id: string;
  name: string;
  categoryName: string;
  description?: string;
}

interface DeckCarouselProps {
  decks: Deck[];
  selectedDeckId: string;
  onSelectDeck: (deckId: string) => void;
  onPlay: () => void;
  disabled?: boolean;
}

const DECK_ICONS: Record<string, string> = {
  "Word Up": "📚",
  "Bloop Words": "🎭",
  "Bloop Facts": "🤯",
  "Movie Bluff": "🎬",
  "India": "🇮🇳",
  "USA": "🇺🇸",
  "Brawl Stars": "🎮",
  "Movie Mania": "🍿",
  "Music Trivia": "🎵",
  "Sports Fan": "⚽",
  "Science Facts": "🔬",
};

const DECK_DESCRIPTIONS: Record<string, string> = {
  "Word Up": "Weird word definitions that sound made up",
  "Bloop Words": "Obscure words with hilarious meanings",
  "Bloop Facts": "Weird facts that sound too crazy to be true",
  "Movie Bluff": "Fake movie plots that could be real",
  "India": "Indian culture and trivia",
  "USA": "American culture and history",
  "Brawl Stars": "All about Brawl Stars game",
  "Movie Mania": "Famous movies and actors",
  "Music Trivia": "Music and artists through the ages",
  "Sports Fan": "Sports and athletes trivia",
  "Science Facts": "Mind-blowing science discoveries",
};

export function DeckCarousel({
  decks,
  selectedDeckId,
  onSelectDeck,
  onPlay,
  disabled = false,
}: DeckCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, decks.findIndex((d) => d.id === selectedDeckId))
  );

  const currentDeck = decks[currentIndex];

  // Sync initial selection with parent on mount or when decks change
  useEffect(() => {
    if (currentDeck && currentDeck.id !== selectedDeckId) {
      onSelectDeck(currentDeck.id);
    }
  }, [currentDeck, selectedDeckId, onSelectDeck]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : decks.length - 1;
    setCurrentIndex(newIndex);
    onSelectDeck(decks[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = currentIndex < decks.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSelectDeck(decks[newIndex].id);
  };

  if (!currentDeck) return null;

  const icon = DECK_ICONS[currentDeck.name] || "🎲";
  const description = DECK_DESCRIPTIONS[currentDeck.name] || currentDeck.description || "A fun deck to play!";

  return (
    <div className="space-y-4">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDeck.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20">
              <div className="p-8 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {currentDeck.categoryName}
                    </Badge>
                    <h3 className="font-display text-3xl font-bold">
                      {currentDeck.name}
                    </h3>
                  </div>
                  <div className="text-6xl">{icon}</div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {description}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-1">
                    {decks.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          index === currentIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {decks.length}
                  </span>
                </div>
              </div>

              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className="text-9xl">{icon}</div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 shadow-lg bg-background hover:bg-accent z-10"
          onClick={handlePrevious}
          disabled={disabled}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 shadow-lg bg-background hover:bg-accent z-10"
          onClick={handleNext}
          disabled={disabled}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <Button
        onClick={onPlay}
        disabled={disabled}
        size="lg"
        className="w-full h-16 text-xl font-display font-bold"
      >
        <Play className="w-6 h-6 mr-2" />
        Play with {currentDeck.name}
      </Button>
    </div>
  );
}
