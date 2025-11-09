import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Check, Clock } from "lucide-react";
import type { GameRoom } from "@shared/schema";

interface ReadyScreenProps {
  room: GameRoom;
  playerId: string;
  onReady: () => void;
}

export function ReadyScreen({ room, playerId, onReady }: ReadyScreenProps) {
  const currentPlayer = room.players.find((p) => p.id === playerId);
  const isReady = currentPlayer?.ready || false;
  const readyCount = room.players.filter((p) => p.ready).length;
  const totalPlayers = room.players.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent">
              Round {room.currentRound}
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-medium text-muted-foreground"
          >
            Are you ready?
          </motion.p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span className="text-lg">
              {readyCount} of {totalPlayers} players ready
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.players.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    player.ready
                      ? "border-chart-3 bg-chart-3/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <PlayerAvatar
                      name={player.name}
                      avatar={player.avatar}
                      isHost={player.isHost}
                      size="md"
                    />
                    <span className="text-sm font-medium text-center truncate w-full">
                      {player.name}
                    </span>
                  </div>
                  {player.ready && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-chart-3 rounded-full p-1"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={onReady}
            disabled={isReady}
            size="lg"
            className="w-full h-16 text-2xl font-display font-bold"
          >
            {isReady ? (
              <>
                <Check className="w-6 h-6 mr-2" />
                Ready!
              </>
            ) : (
              "I'm Ready!"
            )}
          </Button>

          {readyCount === totalPlayers && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-lg font-medium text-chart-3"
            >
              Starting round...
            </motion.p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
