import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Trophy, Home, Crown } from "lucide-react";
import type { GameRoom } from "@shared/schema";

interface EndGameScreenProps {
  room: GameRoom;
  onReturnHome: () => void;
}

export function EndGameScreen({ room, onReturnHome }: EndGameScreenProps) {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <Trophy className="w-24 h-24 text-chart-4" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -top-2 -right-2"
              >
                <Crown className="w-12 h-12 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-6xl font-bold"
          >
            Game Over!
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-medium text-muted-foreground"
          >
            {winner.name} wins!
          </motion.p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-center mb-6">
            Final Scores
          </h2>

          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card
                  className={`p-4 ${
                    index === 0
                      ? "ring-2 ring-chart-4 bg-gradient-to-r from-chart-4/20 to-chart-3/20"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-display text-2xl font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <PlayerAvatar
                        name={player.name}
                        avatar={player.avatar}
                        isHost={player.isHost}
                        size="md"
                      />
                      {index === 0 && (
                        <Crown className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl font-bold tabular-nums">
                        {player.score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        points
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onReturnHome}
            size="lg"
            className="w-full h-16 text-xl font-display font-bold"
          >
            <Home className="w-6 h-6 mr-2" />
            Return to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
