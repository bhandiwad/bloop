import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { GameSettings } from "@/components/GameSettings";
import { SoundToggle } from "@/components/SoundToggle";
import { motion } from "framer-motion";
import { Copy, LogOut, Play, Shield, Bot, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GameRoom, GameSettings as GameSettingsType } from "@shared/schema";

interface LobbyProps {
  room: GameRoom;
  playerId: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onUpdateSettings: (settings: Partial<GameSettingsType>) => void;
  onAddMrBloop?: () => void;
  onRemoveMrBloop?: () => void;
}

export default function Lobby({ room, playerId, onStartGame, onLeaveRoom, onUpdateSettings, onAddMrBloop, onRemoveMrBloop }: LobbyProps) {
  const { toast } = useToast();
  const isHost = room.players.find((p) => p.id === playerId)?.isHost || false;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    toast({
      title: "Room code copied!",
      description: "Share it with your friends to join the game.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="fixed top-4 right-4 z-10">
        <SoundToggle />
      </div>
      <div className="w-full max-w-2xl mx-auto space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="font-display text-3xl font-bold">Game Lobby</h2>

          <Card
            className="p-6 bg-gradient-to-r from-primary to-chart-2 cursor-pointer hover-elevate active-elevate-2"
            onClick={copyRoomCode}
            data-testid="card-room-code"
          >
            <div className="text-center">
              <p className="text-sm text-primary-foreground/80 mb-2">Room Code</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-5xl font-bold text-primary-foreground tracking-widest">
                  {room.code}
                </span>
                <Copy className="w-6 h-6 text-primary-foreground/80" />
              </div>
              <p className="text-xs text-primary-foreground/70 mt-2">
                Tap to copy
              </p>
            </div>
          </Card>

          {room.familySafe && (
            <Badge className="bg-chart-3 text-white gap-1">
              <Shield className="w-3 h-3" />
              Family-Safe Mode Active
            </Badge>
          )}
        </motion.div>

        <Card className="p-6">
          <h3
            className="font-display text-xl font-semibold mb-4"
            data-testid="text-player-count"
          >
            Players ({room.players.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {room.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlayerAvatar
                  name={player.name}
                  avatar={player.avatar}
                  isHost={player.isHost}
                  connected={player.connected}
                  size="lg"
                />
              </motion.div>
            ))}
            {room.players.length < 8 && (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-3xl text-muted-foreground/50">+</span>
                </div>
                <span className="text-xs text-muted-foreground">Waiting...</span>
              </div>
            )}
          </div>
        </Card>

        {isHost ? (
          <div className="space-y-3">
            <GameSettings 
              room={room}
              isHost={isHost}
              onUpdateSettings={onUpdateSettings}
            />
            
            {/* Mr Bloop AI Player */}
            {onAddMrBloop && onRemoveMrBloop && (
              <div className="flex gap-2">
                {!room.players.some(p => p.id === "mr-bloop-ai") ? (
                  <Button
                    onClick={onAddMrBloop}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14"
                  >
                    <Bot className="w-5 h-5 mr-2" />
                    Add Mr Blooper (AI)
                  </Button>
                ) : (
                  <Button
                    onClick={onRemoveMrBloop}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14"
                  >
                    <UserMinus className="w-5 h-5 mr-2" />
                    Remove Mr Blooper
                  </Button>
                )}
              </div>
            )}
            
            <Button
              onClick={onStartGame}
              disabled={room.players.length < 2}
              size="lg"
              className="w-full h-16 text-lg font-display font-semibold"
              data-testid="button-start-game"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game {room.players.length < 2 && "(Need 2+ players)"}
            </Button>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-lg text-muted-foreground">
                Waiting for host to start the game...
              </p>
            </motion.div>
          </Card>
        )}

        <Button
          onClick={onLeaveRoom}
          variant="outline"
          size="lg"
          className="w-full"
          data-testid="button-leave-room"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Leave Room
        </Button>
      </div>
    </div>
  );
}
