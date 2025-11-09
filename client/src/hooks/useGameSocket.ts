import { useState, useEffect, useRef, useCallback } from "react";
import type { GameRoom, ClientMessage, ServerMessage, RoundResult } from "@shared/schema";

const STORAGE_KEY_ROOM_CODE = "bloop_room_code";
const STORAGE_KEY_PLAYER_NAME = "bloop_player_name";

export function useGameSocket() {
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [spyVoteCount, setSpyVoteCount] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const retryAttemptRef = useRef(0);
  const manualCloseRef = useRef(false);
  const reconnectAttemptedRef = useRef(false);

  useEffect(() => {
    manualCloseRef.current = false;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // In development, use the Vite proxy. In production, use the same host
    const wsUrl = import.meta.env.DEV 
      ? `${protocol}//${window.location.host}/ws`
      : `${protocol}//${window.location.host}/ws`;

    const connect = () => {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        wsRef.current = ws;
        setConnected(true);
        setError(null);
        retryAttemptRef.current = 0;
        
        // Auto-reconnect if player was in a game
        if (!reconnectAttemptedRef.current) {
          reconnectAttemptedRef.current = true;
          const savedRoomCode = localStorage.getItem(STORAGE_KEY_ROOM_CODE);
          const savedPlayerName = localStorage.getItem(STORAGE_KEY_PLAYER_NAME);
          const savedAvatar = localStorage.getItem("bloop_player_avatar");
          
          if (savedRoomCode && savedPlayerName && savedAvatar) {
            console.log(`[WebSocket] Attempting auto-reconnect to room ${savedRoomCode} as ${savedPlayerName}`);
            const message: ClientMessage = {
              type: "join_room",
              roomCode: savedRoomCode,
              playerName: savedPlayerName,
              avatar: savedAvatar,
            };
            ws.send(JSON.stringify(message));
          }
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (!manualCloseRef.current) {
          const attempt = retryAttemptRef.current++;
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        setError("Connection error. Please check your network.");
      };

      ws.onmessage = (event) => {
        try {
          const message: ServerMessage = JSON.parse(event.data);

          switch (message.type) {
            case "room_created":
            case "room_joined":
              setRoom(message.room);
              setPlayerId(message.playerId);
              setError(null);
              // Save room code for auto-reconnect
              localStorage.setItem(STORAGE_KEY_ROOM_CODE, message.room.code);
              console.log(`[WebSocket] Joined room ${message.room.code}, saved for auto-reconnect`);
              break;

            case "room_updated":
            case "game_started":
            case "phase_changed":
              console.log(`[WebSocket] Received ${message.type}, room state:`, message.room.state);
              setRoom(message.room);
              break;

            case "round_results":
              setRoundResults(message.results);
              setRoom(message.room);
              break;

            case "error":
              setError(message.message);
              break;

            case "player_joined":
              setRoom((prev) =>
                prev ? { ...prev, players: [...prev.players, message.player] } : prev,
              );
              break;

            case "player_left":
              setRoom((prev) =>
                prev
                  ? { ...prev, players: prev.players.filter((p) => p.id !== message.playerId) }
                  : prev,
              );
              break;

            case "reaction_added":
              setRoom((prev) => {
                if (!prev) return prev;
                const updatedAnswers = prev.answers.map((a) => {
                  if (a.id === message.answerId) {
                    const reactions = a.reactions || [];
                    const existingIndex = reactions.findIndex(r => r.playerId === message.reaction.playerId);
                    if (existingIndex >= 0) {
                      reactions[existingIndex] = message.reaction;
                    } else {
                      reactions.push(message.reaction);
                    }
                    return { ...a, reactions: [...reactions] };
                  }
                  return a;
                });
                return { ...prev, answers: updatedAnswers };
              });
              break;

            case "spy_votes_update":
              // Handle spy vote count updates (stored locally, not in room state)
              console.log(`[Spy] Your answer has ${message.voteCount} votes`);
              setSpyVoteCount(message.voteCount);
              break;
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      wsRef.current = ws;
    };

    connect();

    return () => {
      manualCloseRef.current = true;
      wsRef.current?.close();
    };
  }, []);

  const sendMessage = useCallback((message: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const createRoom = useCallback(
    (playerName: string, avatar: string, deckId: string, familySafe: boolean) => {
      sendMessage({ type: "create_room", playerName, avatar, deckId, familySafe });
    },
    [sendMessage]
  );

  const joinRoom = useCallback(
    (roomCode: string, playerName: string, avatar: string) => {
      sendMessage({ type: "join_room", roomCode, playerName, avatar });
    },
    [sendMessage]
  );

  const startGame = useCallback(() => {
    sendMessage({ type: "start_game" });
  }, [sendMessage]);

  const submitAnswer = useCallback(
    (text: string) => {
      sendMessage({ type: "submit_answer", text });
    },
    [sendMessage]
  );

  const submitVote = useCallback(
    (answerId: string) => {
      sendMessage({ type: "submit_vote", answerId });
    },
    [sendMessage]
  );

  const nextRound = useCallback(() => {
    sendMessage({ type: "next_round" });
    setRoundResults([]);
  }, [sendMessage]);

  const endGame = useCallback(() => {
    sendMessage({ type: "end_game" });
    setRoom(null);
    setPlayerId(null);
    setRoundResults([]);
    // Clear saved room code when game ends
    localStorage.removeItem(STORAGE_KEY_ROOM_CODE);
  }, [sendMessage]);

  const leaveRoom = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendMessage({ type: "leave_room" });
    }
    setRoom(null);
    setPlayerId(null);
    setRoundResults([]);
    setError(null);
    // Clear saved room code so we don't auto-reconnect
    localStorage.removeItem(STORAGE_KEY_ROOM_CODE);
    console.log("[WebSocket] Left room, cleared auto-reconnect data");
  }, [sendMessage]);

  const updateSettings = useCallback((settings: Partial<import("@shared/schema").GameSettings>) => {
    sendMessage({ type: "update_settings", settings });
  }, [sendMessage]);

  const playerReady = useCallback(() => {
    sendMessage({ type: "player_ready" });
  }, [sendMessage]);

  const addMrBloop = useCallback(() => {
    console.log("Sending add_mr_bloop message");
    sendMessage({ type: "add_mr_bloop" });
  }, [sendMessage]);

  const removeMrBloop = useCallback(() => {
    sendMessage({ type: "remove_mr_bloop" });
  }, [sendMessage]);

  const sendReaction = useCallback((answerId: string, reaction: any) => {
    sendMessage({ type: "send_reaction", answerId, reaction });
  }, [sendMessage]);

  const usePowerUp = useCallback((powerUp: any) => {
    sendMessage({ type: "use_power_up", powerUp });
  }, [sendMessage]);

  return {
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
    updateSettings,
    addMrBloop,
    removeMrBloop,
    playerReady,
    sendReaction,
    usePowerUp,
  };
}
