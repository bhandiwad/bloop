import { motion, AnimatePresence } from "framer-motion";
import type { ReactionType } from "@shared/schema";

interface ReactionWheelProps {
  onReaction: (reaction: ReactionType) => void;
  disabled?: boolean;
}

const reactions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "mind_blown", emoji: "🤯", label: "Mind Blown" },
  { type: "hilarious", emoji: "😂", label: "Hilarious" },
  { type: "almost_believed", emoji: "🤔", label: "Almost Believed" },
  { type: "fire", emoji: "🔥", label: "Fire" },
];

export function ReactionWheel({ onReaction, disabled }: ReactionWheelProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {reactions.map(({ type, emoji, label }) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReaction(type)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={label}
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}

interface ReactionDisplayProps {
  reactions?: Array<{ playerId: string; playerName: string; reaction: ReactionType }>;
}

export function ReactionDisplay({ reactions }: ReactionDisplayProps) {
  if (!reactions || reactions.length === 0) return null;

  // Count reactions by type
  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {} as Record<ReactionType, number>);

  const reactionEmojis: Record<ReactionType, string> = {
    mind_blown: "🤯",
    hilarious: "😂",
    almost_believed: "🤔",
    fire: "🔥",
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      <AnimatePresence>
        {Object.entries(reactionCounts).map(([type, count]) => (
          <motion.div
            key={type}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm"
          >
            <span>{reactionEmojis[type as ReactionType]}</span>
            <span className="font-medium">{count}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
