import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useQuery } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Lobby from "@/pages/Lobby";
import Game from "@/pages/Game";
import { Loader2, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function GameApp() {
  const { toast } = useToast();
  const {
    connected,
    room,
    playerId,
    roundResults,
    error,
    spyVoteCount,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    submitVote,
    nextRound,
    endGame,
    leaveRoom,
    addMrBloop,
    removeMrBloop,
    updateSettings,
    playerReady,
    sendReaction,
    usePowerUp,
  } = useGameSocket();

  const [localError, setLocalError] = useState<string | null>(null);
  const [hasShownReconnectToast, setHasShownReconnectToast] = useState(false);

  const { data: decks = [] } = useQuery<
    Array<{ id: string; name: string; categoryName: string }>
  >({
    queryKey: ["/api/decks"],
  });

  // Show reconnect success toast
  useEffect(() => {
    if (room && !hasShownReconnectToast) {
      const savedRoomCode = localStorage.getItem("bloop_room_code");
      if (savedRoomCode === room.code && room.state !== "lobby") {
        setHasShownReconnectToast(true);
        toast({
          title: "Reconnected!",
          description: `Welcome back to room ${room.code}`,
        });
      }
    }
  }, [room, hasShownReconnectToast, toast]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => setLocalError(null), 5000);
      return () => clearTimeout(timer);
    } else {
      // Clear error when it's resolved
      setLocalError(null);
    }
  }, [error, toast]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Connecting to server...</p>
        </div>
      </div>
    );
  }

  const currentView = room
    ? room.state === "lobby"
      ? "lobby"
      : room.state === "ended"
        ? "home"
        : "game"
    : "home";

  return (
    <div className="relative">
      {localError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        </div>
      )}

      {currentView === "home" && (
        <Home
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          availableDecks={decks}
        />
      )}

      {currentView === "lobby" && room && playerId && (
        <Lobby
          room={room}
          playerId={playerId}
          onStartGame={startGame}
          onLeaveRoom={leaveRoom}
          onUpdateSettings={updateSettings}
          onAddMrBloop={addMrBloop}
          onRemoveMrBloop={removeMrBloop}
        />
      )}

      {currentView === "game" && room && playerId && (
        <Game
          room={room}
          playerId={playerId}
          roundResults={roundResults}
          spyVoteCount={spyVoteCount}
          onSubmitAnswer={submitAnswer}
          onSubmitVote={submitVote}
          onNextRound={nextRound}
          onEndGame={endGame}
          onPlayerReady={playerReady}
          onLeaveRoom={leaveRoom}
          onSendReaction={sendReaction}
          onUsePowerUp={usePowerUp}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <GameApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
