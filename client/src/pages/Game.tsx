import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/Timer";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AnswerCard } from "@/components/AnswerCard";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { Confetti } from "@/components/Confetti";
import { ReadyScreen } from "@/components/ReadyScreen";
import { BloopedMessage } from "@/components/BloopedMessage";
import { EndGameScreen } from "@/components/EndGameScreen";
import { HostMenu } from "@/components/HostMenu";
import { ReactionWheel, ReactionDisplay } from "@/components/ReactionWheel";
import { PowerUpButton, SpyDisplay } from "@/components/PowerUpButton";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, Home, Share2, Check } from "lucide-react";
import { fireSideCannons } from "@/lib/confetti";
import { soundManager } from "@/lib/sounds";
import { generateShareableResults, copyToClipboard } from "@/lib/shareResults";
import { useToast } from "@/hooks/use-toast";
import type { GameRoom, RoundResult } from "@shared/schema";

interface GameProps {
  room: GameRoom;
  playerId: string;
  roundResults?: RoundResult[];
  spyVoteCount?: number;
  onSubmitAnswer: (text: string) => void;
  onSubmitVote: (answerId: string) => void;
  onNextRound: () => void;
  onEndGame: () => void;
  onPlayerReady: () => void;
  onLeaveRoom: () => void;
  onSendReaction?: (answerId: string, reaction: any) => void;
  onUsePowerUp?: (powerUp: any) => void;
}

export default function Game({
  room,
  playerId,
  roundResults = [],
  spyVoteCount = 0,
  onSubmitAnswer,
  onSubmitVote,
  onNextRound,
  onEndGame,
  onPlayerReady,
  onLeaveRoom,
  onSendReaction,
  onUsePowerUp,
}: GameProps) {
  const [answerText, setAnswerText] = useState("");
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bloopedConfettiFired, setBloopedConfettiFired] = useState(false);
  const [previousPhase, setPreviousPhase] = useState(room.state);
  const [resultsCopied, setResultsCopied] = useState(false);
  const [showBloopedMessage, setShowBloopedMessage] = useState(false);
  const [bloopedPlayers, setBloopedPlayers] = useState<string[]>([]);
  const [showGotBloopedMessage, setShowGotBloopedMessage] = useState(false);
  const [blooperNames, setBlooperNames] = useState<string[]>([]);
  const [showCorrectAnswerMessage, setShowCorrectAnswerMessage] = useState(false);
  const { toast } = useToast();

  const currentPlayer = room.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const hasSubmittedAnswer = room.answers.some((a) => a.playerId === playerId);
  const hasVoted = room.votes.some((v) => v.playerId === playerId);

  const handleShareResults = async () => {
    const shareText = generateShareableResults(room);
    const success = await copyToClipboard(shareText);
    
    if (success) {
      setResultsCopied(true);
      toast({
        title: "Results copied!",
        description: "Game results copied to clipboard. Share with your friends!",
      });
      setTimeout(() => setResultsCopied(false), 3000);
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy results. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Play transition sound on phase changes
  useEffect(() => {
    if (previousPhase !== room.state) {
      soundManager.play('transition');
      setPreviousPhase(room.state);
    }
  }, [room.state, previousPhase]);

  // Reset confetti trigger when moving to next round
  useEffect(() => {
    if (room.state !== "reveal") {
      setBloopedConfettiFired(false);
    }
  }, [room.state]);

  useEffect(() => {
    if (room.state === "leaderboard" && roundResults.length > 0) {
      const myResult = roundResults.find((r) => r.playerId === playerId);
      if (myResult && myResult.points > 0) {
        setShowConfetti(true);
        soundManager.play('correct');
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [room.state, roundResults, playerId]);

  // Show Bloop'd message when results come in
  useEffect(() => {
    if (roundResults.length > 0 && (room.state === "reveal" || room.state === "leaderboard")) {
      const myResult = roundResults.find((r) => r.playerId === playerId);
      
      // Check if I fooled someone
      if (myResult?.fooledPlayers && myResult.fooledPlayers.length > 0) {
        const fooledNames = myResult.fooledPlayers
          .map((id) => room.players.find((p) => p.id === id)?.name)
          .filter(Boolean) as string[];
        
        if (fooledNames.length > 0) {
          setBloopedPlayers(fooledNames);
          setShowBloopedMessage(true);
          fireSideCannons();
          soundManager.play('fooled');
          // Don't auto-dismiss - user must click
        }
      }
      
      // Check if I got fooled by someone OR got it right
      const myVote = room.votes.find(v => v.playerId === playerId);
      if (myVote) {
        const votedAnswer = room.answers.find(a => a.id === myVote.answerId);
        if (votedAnswer) {
          if (votedAnswer.isCorrect) {
            // I voted for the correct answer!
            setShowCorrectAnswerMessage(true);
            soundManager.play('correct');
          } else if (!votedAnswer.isAI) {
            // I voted for someone's fake answer - I got blooped!
            const blooper = room.players.find(p => p.id === votedAnswer.playerId);
            if (blooper) {
              setBlooperNames([blooper.name]);
              setShowGotBloopedMessage(true);
              soundManager.play('reveal');
            }
          }
        }
      }
    }
  }, [roundResults, room.state, room.players, playerId, room.votes, room.answers, toast]);

  // Trigger confetti and sound when player successfully Bloops others (only once per reveal phase)
  useEffect(() => {
    if (room.state === "reveal" && !bloopedConfettiFired) {
      const myAnswer = room.answers.find((a) => a.playerId === playerId && !a.isCorrect && !a.isAI);
      if (myAnswer && myAnswer.votedBy.length > 0) {
        setBloopedConfettiFired(true);
      }
    }
  }, [room.state, room.answers, playerId, bloopedConfettiFired]);

  const handleSubmitAnswer = () => {
    if (answerText.trim().length >= 3) {
      onSubmitAnswer(answerText.trim());
      soundManager.play('submit');
      setAnswerText("");
    }
  };

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  const handleSubmitVote = () => {
    if (selectedAnswerId) {
      onSubmitVote(selectedAnswerId);
      soundManager.play('vote');
    }
  };

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  // Show ready screen
  if (room.state === "ready") {
    return (
      <>
        <ReadyScreen room={room} playerId={playerId} onReady={onPlayerReady} />
        <BloopedMessage 
          playerNames={bloopedPlayers} 
          show={showBloopedMessage} 
          onDismiss={() => setShowBloopedMessage(false)}
          variant="fooled"
        />
        <BloopedMessage 
          playerNames={blooperNames} 
          show={showGotBloopedMessage} 
          onDismiss={() => setShowGotBloopedMessage(false)}
          variant="got-fooled"
        />
        <BloopedMessage 
          playerNames={[]} 
          show={showCorrectAnswerMessage} 
          onDismiss={() => setShowCorrectAnswerMessage(false)}
          variant="correct"
        />
      </>
    );
  }

  // Show end game screen
  if (room.state === "ended") {
    return <EndGameScreen room={room} onReturnHome={onLeaveRoom} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Confetti active={showConfetti} />
      <BloopedMessage 
        playerNames={bloopedPlayers} 
        show={showBloopedMessage} 
        onDismiss={() => setShowBloopedMessage(false)}
        variant="fooled"
      />
      <BloopedMessage 
        playerNames={blooperNames} 
        show={showGotBloopedMessage} 
        onDismiss={() => setShowGotBloopedMessage(false)}
        variant="got-fooled"
      />
      <BloopedMessage 
        playerNames={[]} 
        show={showCorrectAnswerMessage} 
        onDismiss={() => setShowCorrectAnswerMessage(false)}
        variant="correct"
      />

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="font-display">
              Round {room.currentRound}/{room.totalRounds}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Code: <span className="font-bold">{room.code}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {room.roundEndTime && room.settings.collectTime > 0 && (
              <Timer
                endTime={room.roundEndTime}
                totalDuration={
                  room.state === "collect"
                    ? room.settings.collectTime
                    : room.state === "vote"
                    ? room.settings.voteTime
                    : room.settings.revealTime
                }
              />
            )}
            {isHost && (
              <HostMenu
                room={room}
                playerId={playerId}
                onEndGame={onEndGame}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Phase Indicator */}
          {(room.state === "collect" || room.state === "vote" || room.state === "reveal") && (
            <PhaseIndicator currentPhase={room.state} />
          )}

          {/* Players Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {room.players.map((player) => {
              const hasSubmitted =
                room.state === "collect"
                  ? player.submitted || room.answers.some((a) => a.playerId === player.id)
                  : room.state === "vote"
                  ? room.votes.some((v) => v.playerId === player.id)
                  : false;

              return (
                <PlayerAvatar
                  key={player.id}
                  name={player.name}
                  avatar={player.avatar}
                  isHost={player.isHost}
                  score={player.score}
                  connected={player.connected}
                  submitted={hasSubmitted}
                  showScore
                  size="sm"
                />
              );
            })}
          </div>

          {/* Collect Phase */}
          {room.state === "collect" && room.currentPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-8 bg-gradient-to-br from-card via-card to-primary/5">
                <p
                  className="text-xl md:text-2xl font-medium text-center leading-relaxed"
                  data-testid="text-prompt-question"
                >
                  {room.currentPrompt.questionText}
                </p>
              </Card>

              {!hasSubmittedAnswer ? (
                <div className="space-y-4">
                  {/* Power-Up Button for Swap */}
                  {currentPlayer?.powerUp === "swap" && !currentPlayer.usedPowerUp && (
                    <PowerUpButton
                      powerUp="swap"
                      used={false}
                      onUse={() => onUsePowerUp?.("swap")}
                      disabled={answerText.trim().length < 3}
                    />
                  )}
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Type your fake answer..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      maxLength={100}
                      className="h-14 text-base"
                      data-testid="input-answer"
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {answerText.length}/100 characters
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={answerText.trim().length < 3}
                    size="lg"
                    className="w-full h-14 text-lg font-display font-semibold"
                    data-testid="button-submit-answer"
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <Card className="p-6 text-center bg-chart-3/10">
                  <p className="text-lg font-medium text-chart-3">
                    Answer submitted! Waiting for others...
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {/* Vote Phase */}
          {room.state === "vote" && room.currentPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Spy Power-Up Display */}
              {currentPlayer?.usedPowerUp && spyVoteCount >= 0 && (
                <SpyDisplay voteCount={spyVoteCount} />
              )}

              {/* Power-Up Button for Spy */}
              {currentPlayer?.powerUp === "spy" && !currentPlayer.usedPowerUp && !hasVoted && (
                <PowerUpButton
                  powerUp="spy"
                  used={false}
                  onUse={() => onUsePowerUp?.("spy")}
                />
              )}

              <Card className="p-4 bg-muted/50">
                <p
                  className="text-base font-medium text-center"
                  data-testid="text-vote-prompt"
                >
                  {room.currentPrompt.questionText}
                </p>
              </Card>

              <div className="space-y-3">
                {room.answers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    text={answer.text}
                    selected={selectedAnswerId === answer.id}
                    onClick={() => handleSelectAnswer(answer.id)}
                    disabled={hasVoted || answer.playerId === playerId}
                  />
                ))}
              </div>

              {!hasVoted ? (
                <Button
                  onClick={handleSubmitVote}
                  disabled={!selectedAnswerId}
                  size="lg"
                  className="w-full h-14 text-lg font-display font-semibold"
                  data-testid="button-submit-vote"
                >
                  Submit Vote
                </Button>
              ) : (
                <Card className="p-6 text-center bg-chart-3/10">
                  <p className="text-lg font-medium text-chart-3">
                    Vote submitted! Waiting for others...
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {/* Reveal Phase */}
          {room.state === "reveal" && room.currentPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="p-4 bg-muted/50">
                <p
                  className="text-base font-medium text-center"
                  data-testid="text-reveal-prompt"
                >
                  {room.currentPrompt.questionText}
                </p>
              </Card>

              {/* Show who got Bloop'ed by your answer */}
              {(() => {
                const myAnswer = room.answers.find((a) => a.playerId === playerId && !a.isCorrect && !a.isAI);
                if (myAnswer && myAnswer.votedBy.length > 0) {
                  const fooledPlayers = myAnswer.votedBy
                    .map((voterId) => room.players.find((p) => p.id === voterId)?.name)
                    .filter(Boolean);
                  
                  if (fooledPlayers.length > 0) {
                    return (
                      <Card className="p-4 bg-chart-4/10 border-chart-4">
                        <p className="text-center font-display text-lg font-semibold text-chart-4 flex items-center justify-center gap-2">
                          <Trophy className="w-5 h-5" />
                          {fooledPlayers.join(", ")} got Bloop'ed by you!
                        </p>
                      </Card>
                    );
                  }
                }
                return null;
              })()}

              <div className="space-y-3">
                {room.answers.map((answer) => (
                  <div key={answer.id} className="space-y-2">
                    <AnswerCard
                      text={answer.text}
                      playerName={answer.playerName}
                      isCorrect={answer.isCorrect}
                      isAI={answer.isAI}
                      votes={answer.votedBy.length}
                      revealed
                    />
                    {/* Reaction Display for each answer */}
                    <ReactionDisplay reactions={answer.reactions} />
                    {/* Reaction Wheel for each answer */}
                    <div className="ml-2">
                      <ReactionWheel
                        onReaction={(reaction) => onSendReaction?.(answer.id, reaction)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {roundResults.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-4">
                    Round Points
                  </h3>
                  <div className="space-y-3">
                    {roundResults.map((result) => (
                      <motion.div
                        key={result.playerId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <span className="font-medium">{result.playerName}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={result.points > 0 ? "default" : "secondary"}
                            className={result.points > 0 ? "bg-chart-3" : ""}
                          >
                            {result.points > 0 ? "+" : ""}{result.points}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.reason === "correct" && "Correct!"}
                            {result.reason === "fooled_others" && "Fooled players"}
                            {result.reason === "fooled_all" && "Fooled everyone!"}
                            {result.reason === "timeout" && "Too slow"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* Leaderboard Phase */}
          {room.state === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-chart-4" />
                <h2
                  className="font-display text-3xl font-bold mb-2"
                  data-testid="text-leaderboard-title"
                >
                  Leaderboard
                </h2>
                <p className="text-muted-foreground" data-testid="text-round-info">
                  Round {room.currentRound} of {room.totalRounds}
                </p>
              </div>

              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-6 ${
                        index === 0 ? "ring-2 ring-chart-4 bg-chart-4/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-display text-3xl font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                          <PlayerAvatar
                            name={player.name}
                            avatar={player.avatar}
                            isHost={player.isHost}
                            size="md"
                          />
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

              <div className="space-y-3">
                {room.currentRound >= room.totalRounds && (
                  <Button
                    onClick={handleShareResults}
                    size="lg"
                    variant="outline"
                    className="w-full h-14 text-lg font-display font-semibold"
                    data-testid="button-share-results"
                  >
                    {resultsCopied ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        Share Results
                      </>
                    )}
                  </Button>
                )}
                {isHost && (
                  <>
                    {room.currentRound < room.totalRounds ? (
                      <Button
                        onClick={onNextRound}
                        size="lg"
                        className="w-full h-14 text-lg font-display font-semibold"
                        data-testid="button-next-round"
                      >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Next Round ({room.currentRound + 1}/{room.totalRounds})
                      </Button>
                    ) : (
                      <Button
                        onClick={onEndGame}
                        size="lg"
                        className="w-full h-14 text-lg font-display font-semibold bg-chart-5 hover:bg-chart-5/90"
                        data-testid="button-end-game"
                      >
                        <Home className="w-5 h-5 mr-2" />
                        End Game (Final Round Complete)
                      </Button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
