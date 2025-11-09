import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { gameEngine } from "./services/gameEngine";
import { scoringService } from "./services/scoringService";
import { aiService } from "./services/aiService";
import { redisGameStore } from "./services/redisGameStore";
import type { ClientMessage, ServerMessage } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // REST API endpoints
  app.get("/api/decks", async (req, res) => {
    try {
      const allDecks = await storage.getAllDecks();
      const categories = await storage.getAllDeckCategories();

      const decksWithCategories = allDecks.map((deck) => {
        const category = categories.find((c) => c.id === deck.categoryId);
        return {
          id: deck.id,
          name: deck.name,
          categoryName: category?.name || "Unknown",
          description: deck.description,
          familySafe: deck.familySafe,
        };
      });

      res.json(decksWithCategories);
    } catch (error) {
      console.error("Error fetching decks:", error);
      res.status(500).json({ error: "Failed to fetch decks" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server setup - using /ws path to avoid conflict with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const playerSockets = new Map<string, WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");

    let currentPlayerId: string | null = null;

    ws.on("message", async (data: Buffer) => {
      try {
        const message: ClientMessage = JSON.parse(data.toString());
        console.log("Received WebSocket message:", message.type);

        switch (message.type) {
          case "create_room": {
            const { room, playerId } = await gameEngine.createRoom(
              message.playerName,
              message.avatar,
              message.deckId,
              message.familySafe,
              message.settings
            );

            currentPlayerId = playerId;
            playerSockets.set(playerId, ws);

            const response: ServerMessage = {
              type: "room_created",
              room,
              playerId,
            };

            ws.send(JSON.stringify(response));
            break;
          }

          case "join_room": {
            const result = await gameEngine.joinRoom(
              message.roomCode,
              message.playerName,
              message.avatar
            );

            if (!result) {
              const errorResponse: ServerMessage = {
                type: "error",
                message: "Room not found or game already started",
              };
              ws.send(JSON.stringify(errorResponse));
              break;
            }

            currentPlayerId = result.playerId;
            playerSockets.set(result.playerId, ws);

            const response: ServerMessage = {
              type: "room_joined",
              room: result.room,
              playerId: result.playerId,
            };

            ws.send(JSON.stringify(response));

            // Notify other players in the room
            broadcastToRoom(result.room.id, {
              type: "room_updated",
              room: result.room,
            });

            break;
          }

          case "start_game": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) break;

            const startedRoom = await gameEngine.startGame(room.id);
            if (startedRoom) {
              broadcastToRoom(startedRoom.id, {
                type: "game_started",
                room: startedRoom,
              });
            }
            break;
          }

          case "player_ready": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player) break;

            player.ready = true;
            await (await import("./services/redisGameStore")).redisGameStore.saveRoom(room);

            broadcastToRoom(room.id, {
              type: "room_updated",
              room,
            });

            const allReady = room.players.every((p) => p.ready);
            if (allReady && room.state === "ready") {
              room.players.forEach((p) => p.ready = false);
              const nextRoom = await gameEngine.startRound(room.id);
              if (nextRoom) {
                broadcastToRoom(nextRoom.id, {
                  type: "room_updated",
                  room: nextRoom,
                });
              }
            }
            break;
          }

          case "submit_answer": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const updatedRoom = await gameEngine.submitAnswer(
              room.id,
              currentPlayerId,
              message.text
            );

            if (updatedRoom) {
              broadcastToRoom(updatedRoom.id, {
                type: "room_updated",
                room: updatedRoom,
              });
            }
            break;
          }

          case "submit_vote": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const updatedRoom = await gameEngine.submitVote(
              room.id,
              currentPlayerId,
              message.answerId
            );

            if (updatedRoom) {
              broadcastToRoom(updatedRoom.id, {
                type: "room_updated",
                room: updatedRoom,
              });

              // Send spy updates to players who used spy power-up
              updatedRoom.players.forEach((player) => {
                if (player.usedPowerUp && player.powerUp === "spy") {
                  const playerAnswer = updatedRoom.answers.find(a => a.playerId === player.id);
                  if (playerAnswer) {
                    const voteCount = playerAnswer.votedBy.length;
                    const playerWs = playerSockets.get(player.id);
                    if (playerWs?.readyState === WebSocket.OPEN) {
                      playerWs.send(JSON.stringify({
                        type: "spy_votes_update",
                        voteCount,
                      }));
                    }
                  }
                }
              });

              // If all voted, calculate and send results
              if (updatedRoom.state === "reveal") {
                const results = scoringService.calculateRoundResults(updatedRoom);
                broadcastToRoom(updatedRoom.id, {
                  type: "round_results",
                  results,
                  room: updatedRoom,
                });
              }
            }
            break;
          }

          case "use_power_up": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player || !player.powerUp || player.usedPowerUp) break;

            const powerUp = message.powerUp;
            console.log(`[use_power_up] Player ${player.name} using ${powerUp} power-up`);

            if (powerUp === "swap" && room.state === "collect") {
              // Swap: Generate AI answer and replace player's answer
              try {
                if (!room.currentPrompt) break;
                
                const existingAnswers = room.answers.map(a => a.text);
                const aiAnswer = await aiService.generateFakeAnswer(
                  room.currentPrompt.questionText,
                  room.currentPrompt.correctAnswer,
                  existingAnswers
                );

                // Find player's existing answer and replace it
                const playerAnswer = room.answers.find(a => a.playerId === currentPlayerId);
                if (playerAnswer) {
                  playerAnswer.text = aiAnswer;
                  player.usedPowerUp = true;
                  await redisGameStore.saveRoom(room);
                  
                  broadcastToRoom(room.id, {
                    type: "room_updated",
                    room,
                  });
                }
              } catch (error) {
                console.error("[use_power_up] Swap power-up failed:", error);
              }
            } else if (powerUp === "spy" && room.state === "vote") {
              // Spy: Mark as used and send initial vote count
              player.usedPowerUp = true;
              await redisGameStore.saveRoom(room);

              const playerAnswer = room.answers.find(a => a.playerId === currentPlayerId);
              const voteCount = playerAnswer?.votedBy.length || 0;

              ws.send(JSON.stringify({
                type: "spy_votes_update",
                voteCount,
              }));

              broadcastToRoom(room.id, {
                type: "room_updated",
                room,
              });
            }
            break;
          }

          case "next_round": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) break;

            const nextRoom = await gameEngine.nextRound(room.id);
            if (nextRoom) {
              broadcastToRoom(nextRoom.id, {
                type: "phase_changed",
                phase: nextRoom.state,
                room: nextRoom,
              });
            }
            break;
          }

          case "end_game": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) break;

            room.state = "ended";
            await (await import("./services/redisGameStore")).redisGameStore.saveRoom(room);
            
            broadcastToRoom(room.id, {
              type: "room_updated",
              room,
            });

            setTimeout(async () => {
              await gameEngine.endGame(room.id);
              for (const p of room.players) {
                playerSockets.delete(p.id);
              }
            }, 5000);
            break;
          }

          case "leave_room": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const leavingIndex = room.players.findIndex((p) => p.id === currentPlayerId);
            if (leavingIndex >= 0) {
              const wasHost = room.players[leavingIndex].isHost;
              room.players.splice(leavingIndex, 1);
              if (wasHost && room.players.length > 0) {
                room.players[0].isHost = true;
              }
              await storage.getAllDecks(); // no-op to keep file import used
              await (await import("./services/redisGameStore")).redisGameStore.saveRoom(room);
              await (await import("./services/redisGameStore")).redisGameStore.deletePlayerMapping(currentPlayerId);

              const leftResponse: ServerMessage = { type: "player_left", playerId: currentPlayerId };
              ws.send(JSON.stringify(leftResponse));

              broadcastToRoom(room.id, { type: "room_updated", room });
            }

            playerSockets.delete(currentPlayerId);
            currentPlayerId = null;
            break;
          }

          case "update_settings": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) break;

            const updatedRoom = await gameEngine.updateSettings(
              room.id,
              message.settings
            );

            if (updatedRoom) {
              broadcastToRoom(updatedRoom.id, {
                type: "room_updated",
                room: updatedRoom,
              });
            }
            break;
          }

          case "add_mr_bloop": {
            console.log("Add Mr Blooper request received");
            if (!currentPlayerId) {
              console.log("No current player ID");
              break;
            }

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) {
              console.log("Room not found");
              break;
            }

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) {
              console.log("Player is not host");
              break;
            }

            const { mrBloopService } = await import("./services/mrBloopService");
            
            // Check if Mr Blooper is already in the room
            if (mrBloopService.isInRoom(room)) {
              console.log("Mr Blooper already in room");
              ws.send(JSON.stringify({
                type: "error",
                message: "Mr Blooper is already in the game!",
              }));
              break;
            }

            // Add Mr Blooper to the room
            const mrBloop = mrBloopService.createMrBloop();
            room.players.push(mrBloop);
            console.log(`Mr Blooper added to room ${room.id}, total players: ${room.players.length}`);
            
            await (await import("./services/redisGameStore")).redisGameStore.saveRoom(room);
            
            broadcastToRoom(room.id, {
              type: "room_updated",
              room,
            });
            break;
          }

          case "remove_mr_bloop": {
            if (!currentPlayerId) break;

            const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
            if (!room) break;

            const player = room.players.find((p) => p.id === currentPlayerId);
            if (!player?.isHost) break;

            const { mrBloopService } = await import("./services/mrBloopService");
            
            // Find and remove Mr Blooper
            const mrBloopIndex = room.players.findIndex(p => mrBloopService.isMrBloop(p.id));
            if (mrBloopIndex >= 0) {
              room.players.splice(mrBloopIndex, 1);
              await (await import("./services/redisGameStore")).redisGameStore.saveRoom(room);
              
              broadcastToRoom(room.id, {
                type: "room_updated",
                room,
              });
            }
            break;
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        const errorResponse: ServerMessage = {
          type: "error",
          message: "An error occurred processing your request",
        };
        ws.send(JSON.stringify(errorResponse));
      }
    });

    ws.on("close", async () => {
      if (currentPlayerId) {
        const room = await gameEngine.getRoomByPlayerId(currentPlayerId);
        if (room) {
          const player = room.players.find((p) => p.id === currentPlayerId);
          if (player) {
            player.connected = false;
            broadcastToRoom(room.id, {
              type: "player_left",
              playerId: currentPlayerId,
            });
            broadcastToRoom(room.id, {
              type: "room_updated",
              room,
            });
          }
        }
        playerSockets.delete(currentPlayerId);
      }
    });
  });

  async function broadcastToRoom(roomId: string, message: ServerMessage) {
    const room = await gameEngine.getRoom(roomId);
    if (!room) return;

    const messageStr = JSON.stringify(message);

    for (const player of room.players) {
      const socket = playerSockets.get(player.id);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr);
      }
    }
  }

  // Set up callback for automatic phase transitions (reveal -> leaderboard)
  gameEngine.onPhaseChange = (roomId, room, results) => {
    if (results) {
      broadcastToRoom(roomId, {
        type: "round_results",
        results,
        room,
      });
    } else {
      broadcastToRoom(roomId, {
        type: "room_updated",
        room,
      });
    }
  };

  return httpServer;
}
