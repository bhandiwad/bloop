import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Gamepad2, Users, Shield } from "lucide-react";
import { SoundToggle } from "@/components/SoundToggle";
import { DeckCarousel } from "@/components/DeckCarousel";
import { AVATAR_OPTIONS, getRandomAvatar } from "@shared/avatars";
import { cn } from "@/lib/utils";

const STORAGE_KEY_NAME = "bloop_player_name";
const STORAGE_KEY_AVATAR = "bloop_player_avatar";

interface HomeProps {
  onCreateRoom: (playerName: string, avatarId: string, deckId: string, familySafe: boolean) => void;
  onJoinRoom: (roomCode: string, playerName: string, avatarId: string) => void;
  availableDecks: Array<{ id: string; name: string; categoryName: string }>;
}

export default function Home({ onCreateRoom, onJoinRoom, availableDecks }: HomeProps) {
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(getRandomAvatar().id);
  const [roomCode, setRoomCode] = useState("");
  const [selectedDeck, setSelectedDeck] = useState(availableDecks[0]?.id || "");
  const [familySafe, setFamilySafe] = useState(true);

  // Load saved player name and avatar from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);
    const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
    if (savedName) {
      setPlayerName(savedName);
    }
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
  }, []);

  const handleCreateRoom = () => {
    if (playerName.trim() && selectedDeck) {
      // Save player name and avatar to localStorage
      localStorage.setItem(STORAGE_KEY_NAME, playerName.trim());
      localStorage.setItem(STORAGE_KEY_AVATAR, selectedAvatar);
      onCreateRoom(playerName.trim(), selectedAvatar, selectedDeck, familySafe);
    }
  };

  const handleJoinRoom = () => {
    if (playerName.trim() && roomCode.trim()) {
      // Save player name and avatar to localStorage
      localStorage.setItem(STORAGE_KEY_NAME, playerName.trim());
      localStorage.setItem(STORAGE_KEY_AVATAR, selectedAvatar);
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim(), selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="fixed top-4 right-4 z-10">
        <SoundToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1
          className="font-display text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent mb-2"
          data-testid="text-app-title"
        >
          Bloop
        </h1>
        <p className="text-muted-foreground text-lg">
          Bluff, guess, and fool your friends!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        {!mode ? (
          <div className="space-y-4">
            <Button
              onClick={() => setMode("create")}
              size="lg"
              className="w-full h-16 text-lg font-display font-semibold"
              data-testid="button-create-room"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Create Room
            </Button>
            <Button
              onClick={() => setMode("join")}
              variant="outline"
              size="lg"
              className="w-full h-16 text-lg font-display font-semibold"
              data-testid="button-join-room"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Room
            </Button>
          </div>
        ) : (
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="player-name">Your Name</Label>
              <Input
                id="player-name"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="h-14 text-base"
                data-testid="input-player-name"
              />
            </div>

            <div className="space-y-2">
              <Label>Choose Your Avatar</Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {AVATAR_OPTIONS.map((avatar) => {
                  const Icon = avatar.icon;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={cn(
                        "flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all hover-elevate active-elevate-2",
                        selectedAvatar === avatar.id
                          ? "bg-primary/20 border-2 border-primary ring-2 ring-primary/30"
                          : "bg-muted/50 border-2 border-transparent"
                      )}
                      data-testid={`button-avatar-${avatar.id}`}
                    >
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", avatar.color)}>
                        <Icon className="w-7 h-7 text-primary-foreground stroke-[2.5]" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">{avatar.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {mode === "join" ? (
              <div className="space-y-2">
                <Label htmlFor="room-code">Room Code</Label>
                <Input
                  id="room-code"
                  placeholder="A B 3 K"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  className="h-16 text-4xl font-display font-bold text-center tracking-[0.5em] uppercase"
                  data-testid="input-room-code"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Choose Your Deck</Label>
                  <DeckCarousel
                    decks={availableDecks}
                    selectedDeckId={selectedDeck}
                    onSelectDeck={setSelectedDeck}
                    onPlay={handleCreateRoom}
                    disabled={!playerName.trim()}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-chart-3" />
                    <Label htmlFor="family-safe" className="cursor-pointer">
                      Family-Safe Mode
                    </Label>
                  </div>
                  <Switch
                    id="family-safe"
                    checked={familySafe}
                    onCheckedChange={setFamilySafe}
                    data-testid="switch-family-safe"
                  />
                </div>
              </>
            )}

            {mode === "join" && (
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleJoinRoom}
                  disabled={
                    !playerName.trim() ||
                    roomCode.length !== 4
                  }
                  size="lg"
                  className="w-full h-14 text-lg font-display font-semibold"
                  data-testid="button-join-submit"
                >
                  Join Room
                </Button>
              </div>
            )}

            <div className="pt-2">
              <Button
                onClick={() => setMode(null)}
                variant="ghost"
                size="lg"
                className="w-full"
                data-testid="button-back"
              >
                Back
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
