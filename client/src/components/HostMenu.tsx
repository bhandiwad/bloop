import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Share2,
  UserX,
  Settings,
  Volume2,
  Home,
  Copy,
  Check,
} from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { useToast } from "@/hooks/use-toast";
import type { GameRoom } from "@shared/schema";

interface HostMenuProps {
  room: GameRoom;
  playerId: string;
  onEndGame: () => void;
}

export function HostMenu({ room, playerId, onEndGame }: HostMenuProps) {
  const [open, setOpen] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const { toast } = useToast();

  const currentPlayer = room.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;

  if (!isHost) return null;

  const handleShareCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCodeCopied(true);
      toast({
        title: "Code copied!",
        description: `Room code ${room.code} copied to clipboard`,
      });
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy room code",
        variant: "destructive",
      });
    }
  };

  const handleEndGame = () => {
    if (confirm("Are you sure you want to end the game for everyone?")) {
      onEndGame();
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Host Menu</SheetTitle>
          <SheetDescription>
            Manage your game room
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Room Code */}
          <Card className="p-4 bg-primary/5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Room Code</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-bold tracking-wider">
                  {room.code}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShareCode}
                  className="rounded-full"
                >
                  {codeCopied ? (
                    <Check className="w-5 h-5 text-chart-3" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Players List */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Players ({room.players.length})
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {room.players.map((player) => (
                <Card
                  key={player.id}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={player.name}
                      avatar={player.avatar}
                      isHost={player.isHost}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {player.score} pts
                        </Badge>
                        {!player.connected && (
                          <Badge variant="destructive" className="text-xs">
                            Offline
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {player.id !== playerId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        toast({
                          title: "Remove player",
                          description: "This feature is coming soon!",
                        });
                      }}
                    >
                      <UserX className="w-4 h-4" />
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Sound options",
                  description: "Use the speaker icon in the top right!",
                });
              }}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Sound Options
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Change deck",
                  description: "You can change the deck in the lobby before starting!",
                });
              }}
            >
              <Settings className="w-5 h-5 mr-2" />
              Game Settings
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleEndGame}
            >
              <Home className="w-5 h-5 mr-2" />
              End Game
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
