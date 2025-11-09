import type { GameRoom, Player, Prompt, Answer, Vote, RoundResult } from "@shared/schema";
import { storage } from "../storage";
import { aiService } from "./aiService";
import { moderationService } from "./moderationService";
import { scoringService } from "./scoringService";
import { redisGameStore } from "./redisGameStore";
import { randomUUID } from "crypto";

export class GameEngine {
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();
  
  private clearTimer(roomId: string): void {
    const existingTimer = this.activeTimers.get(roomId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.activeTimers.delete(roomId);
    }
  }
  
  private setTimer(roomId: string, callback: () => void, delay: number): void {
    this.clearTimer(roomId);
    const timer = setTimeout(callback, delay);
    this.activeTimers.set(roomId, timer);
  }
  
  async generateUniqueRoomCode(): Promise<string> {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let attempts = 0;
    
    while (attempts < 10) {
      let code = "";
      for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      
      const isUnique = await redisGameStore.isRoomCodeUnique(code);
      if (isUnique) return code;
      
      attempts++;
    }
    
    throw new Error("Failed to generate unique room code");
  }

  async createRoom(
    playerName: string,
    avatar: string,
    deckId: string,
    familySafe: boolean,
    customSettings?: Partial<import("@shared/schema").GameSettings>
  ): Promise<{ room: GameRoom; playerId: string }> {
    const roomId = randomUUID();
    const code = await this.generateUniqueRoomCode();
    const playerId = randomUUID();

    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: true,
      avatar: avatar,
      score: 0,
      connected: true,
    };

    const defaultSettings = {
      collectTime: 0,
      voteTime: 0,
      revealTime: 0,
      pointsCorrect: 2,
      pointsPerFool: 1,
      pointsFoolAll: 2,
      pointsTimeout: -1,
    };

    const room: GameRoom = {
      id: roomId,
      code,
      players: [player],
      state: "lobby",
      currentRound: 0,
      totalRounds: customSettings?.totalRounds ?? 3,
      deckId,
      familySafe,
      answers: [],
      votes: [],
      settings: {
        ...defaultSettings,
        ...customSettings,
      },
    };

    await redisGameStore.saveRoom(room);

    return { room, playerId };
  }

  async joinRoom(
    roomCode: string,
    playerName: string,
    avatar: string
  ): Promise<{ room: GameRoom; playerId: string } | null> {
    const room = await redisGameStore.getRoomByCode(roomCode);

    if (!room) {
      return null;
    }

    // Check if player is reconnecting (same name exists in room)
    const existingPlayer = room.players.find(p => p.name === playerName);
    
    if (existingPlayer) {
      // Reconnecting player - restore their session
      console.log(`[joinRoom] Player ${playerName} reconnecting to room ${room.id} in state ${room.state}`);
      existingPlayer.connected = true;
      // Keep their existing ID, score, and other properties
      await redisGameStore.saveRoom(room);
      return { room, playerId: existingPlayer.id };
    }

    // New player joining
    if (room.state !== "lobby") {
      // Don't allow new players to join mid-game
      console.log(`[joinRoom] New player ${playerName} attempted to join room ${room.id} in state ${room.state} - rejected`);
      return null;
    }

    // New player joining lobby
    const playerId = randomUUID();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      avatar: avatar,
      score: 0,
      connected: true,
    };

    room.players.push(player);
    await redisGameStore.saveRoom(room);

    console.log(`[joinRoom] New player ${playerName} joined room ${room.id} in lobby`);
    return { room, playerId };
  }

  async startGame(roomId: string): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room || room.state !== "lobby" || room.players.length < 2) {
      return null;
    }

    room.currentRound = 1;
    room.state = "ready";
    
    // Assign random power-ups to each player (50/50 swap or spy)
    room.players.forEach((p) => {
      p.ready = false;
      p.powerUp = Math.random() < 0.5 ? "swap" : "spy";
      p.usedPowerUp = false;
    });
    
    await redisGameStore.saveRoom(room);
    
    console.log(`[startGame] Assigned power-ups to ${room.players.length} players in room ${roomId}`);
    
    // Make Mr Blooper automatically ready after a short delay
    this.scheduleMrBloopReady(roomId);
    
    return room;
  }

  private async scheduleMrBloopReady(roomId: string): Promise<void> {
    const { mrBloopService } = await import("./mrBloopService");
    const room = await redisGameStore.getRoom(roomId);
    if (!room || !mrBloopService.isInRoom(room) || room.state !== "ready") return;

    // Mr Blooper gets ready quickly (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    setTimeout(async () => {
      const currentRoom = await redisGameStore.getRoom(roomId);
      if (!currentRoom || currentRoom.state !== "ready") return;

      mrBloopService.setReady(currentRoom);
      await redisGameStore.saveRoom(currentRoom);
      
      if (this.onPhaseChange) {
        this.onPhaseChange(roomId, currentRoom);
      }
    }, delay);
  }

  async startRound(roomId: string): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room) return null;

    console.log(`[startRound] Starting round ${room.currentRound} for room ${roomId}, previous state: ${room.state}`);

    // Get prompts excluding recently used ones
    const usedPromptIds = room.usedPromptIds || [];
    let prompt = await storage.getRandomPrompt(room.deckId, room.familySafe);
    
    // Try up to 5 times to find an unused prompt
    let attempts = 0;
    while (prompt && usedPromptIds.includes(prompt.id) && attempts < 5) {
      prompt = await storage.getRandomPrompt(room.deckId, room.familySafe);
      attempts++;
    }
    
    if (!prompt) return null;
    
    // Track used prompts (keep last 10)
    if (!room.usedPromptIds) room.usedPromptIds = [];
    room.usedPromptIds.push(prompt.id);
    if (room.usedPromptIds.length > 10) {
      room.usedPromptIds = room.usedPromptIds.slice(-10);
    }

    room.currentPrompt = prompt;
    room.answers = [];
    room.votes = [];
    room.state = "collect";
    // Reset submitted flag for all players
    room.players.forEach(player => {
      player.submitted = false;
    });
    if (room.settings.collectTime > 0) {
      room.roundEndTime = Date.now() + room.settings.collectTime * 1000;
      this.setTimer(roomId, () => this.autoAdvancePhase(roomId), room.settings.collectTime * 1000);
    } else {
      delete room.roundEndTime;
      // Don't auto-advance when timer is 0
    }

    await redisGameStore.saveRoom(room);

    // Make Mr Blooper submit an answer after a delay
    this.scheduleMrBloopAnswer(roomId);

    return room;
  }

  private async scheduleMrBloopAnswer(roomId: string): Promise<void> {
    const { mrBloopService } = await import("./mrBloopService");
    const room = await redisGameStore.getRoom(roomId);
    if (!room || !mrBloopService.isInRoom(room) || room.state !== "collect") return;

    const delay = mrBloopService.getThinkingDelay();
    setTimeout(async () => {
      const currentRoom = await redisGameStore.getRoom(roomId);
      if (!currentRoom || currentRoom.state !== "collect" || !currentRoom.currentPrompt) return;

      // Check if Mr Blooper already submitted
      const mrBloopPlayer = currentRoom.players.find(p => mrBloopService.isMrBloop(p.id));
      if (!mrBloopPlayer || mrBloopPlayer.submitted) return;

      try {
        const existingAnswers = currentRoom.answers.map(a => a.text);
        const mrBloopAnswer = await mrBloopService.generateAnswer(
          currentRoom.currentPrompt.questionText,
          currentRoom.currentPrompt.correctAnswer,
          existingAnswers
        );

        await this.submitAnswer(roomId, mrBloopPlayer.id, mrBloopAnswer);
      } catch (error) {
        console.error("Mr Blooper failed to submit answer:", error);
      }
    }, delay);
  }

  async submitAnswer(roomId: string, playerId: string, text: string): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room || room.state !== "collect") return null;

    const moderated = moderationService.filterAnswer(text, room.familySafe);
    if (!moderated) return null;

    const player = room.players.find((p) => p.id === playerId);
    if (!player) return null;

    const answer: Answer = {
      id: randomUUID(),
      playerId,
      playerName: player.name,
      text: moderated,
      isCorrect: false,
      isAI: false,
      votedBy: [],
    };

    room.answers.push(answer);
    player.submitted = true;
    await redisGameStore.saveRoom(room);
    
    console.log(`Player ${player.name} submitted answer. Total answers: ${room.answers.length}/${room.players.length}`);

    if (this.allPlayersSubmitted(room)) {
      console.log(`All players submitted, preparing voting for room ${roomId}`);
      this.clearTimer(roomId); // Clear auto-advance timer since we're manually advancing
      try {
        await this.prepareVoting(roomId);
        // Get updated room after phase change
        const updatedRoom = await redisGameStore.getRoom(roomId);
        return updatedRoom;
      } catch (error) {
        console.error("Error preparing voting, forcing advancement:", error);
        // Force advancement even if there's an error
        room.state = "vote";
        room.roundEndTime = Date.now() + room.settings.voteTime * 1000;
        await redisGameStore.saveRoom(room);
        return room;
      }
    }

    return room;
  }

  async submitVote(roomId: string, playerId: string, answerId: string): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room || room.state !== "vote") return null;

    const answer = room.answers.find((a) => a.id === answerId);
    if (!answer || answer.playerId === playerId) return null;

    const existingVote = room.votes.findIndex((v) => v.playerId === playerId);
    if (existingVote >= 0) {
      room.votes.splice(existingVote, 1);
    }

    room.votes.push({ playerId, answerId });
    answer.votedBy.push(playerId);

    await redisGameStore.saveRoom(room);

    if (this.allPlayersVoted(room)) {
      this.clearTimer(roomId); // Clear auto-advance timer since we're manually advancing
      await this.revealAnswers(roomId);
      // Get updated room after phase change
      const updatedRoom = await redisGameStore.getRoom(roomId);
      return updatedRoom;
    }

    return room;
  }

  async nextRound(roomId: string): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room) return null;

    if (room.currentRound >= room.totalRounds) {
      room.state = "ended";
      await redisGameStore.saveRoom(room);
      return room;
    }

    room.currentRound++;
    return await this.startRound(roomId);
  }

  async endGame(roomId: string): Promise<void> {
    this.clearTimer(roomId);
    await redisGameStore.deleteRoom(roomId);
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    return await redisGameStore.getRoom(roomId);
  }

  async getRoomByPlayerId(playerId: string): Promise<GameRoom | null> {
    return await redisGameStore.getRoomByPlayerId(playerId);
  }

  private allPlayersSubmitted(room: GameRoom): boolean {
    return room.answers.filter((a) => !a.isAI).length === room.players.length;
  }

  private allPlayersVoted(room: GameRoom): boolean {
    return room.votes.length === room.players.length;
  }

  private async prepareVoting(roomId: string): Promise<void> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room || !room.currentPrompt) {
      console.log(`[prepareVoting] Cannot prepare voting for room ${roomId}: ${!room ? 'room not found' : 'no current prompt'}`);
      return;
    }

    console.log(`[prepareVoting] Preparing voting for room ${roomId}, current state: ${room.state}, answers: ${room.answers.length}`);

    // Generate contextual fallback answers (AI disabled due to content filtering)
    const generateContextualFallback = (question: string, existingAnswers: string[]): string => {
      // Extract key words from the question to make answers more relevant
      const questionWords = question
        .toLowerCase()
        .replace(/[?'"]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['what', 'does', 'where', 'when', 'which', 'describe', 'mean'].includes(word));
      
      const templates = [
        questionWords.length > 0 ? `The common ${questionWords[0]} theory` : "The popular misconception",
        questionWords.length > 0 ? `What people confuse with ${questionWords[0]}` : "What most people confuse it with",
        questionWords.length > 1 ? `A ${questionWords[0]} related to ${questionWords[1]}` : "A related but incorrect concept",
        "The textbook definition that's actually wrong",
        questionWords.length > 0 ? `The ${questionWords[0]} explanation nobody believes` : "The explanation nobody believes",
        "What it was called before the official name",
        questionWords.length > 0 ? `Something involving ${questionWords[0]} incorrectly` : "A commonly believed myth",
        "The answer that seems obvious but isn't",
        questionWords.length > 1 ? `When ${questionWords[0]} meets ${questionWords[1]}` : "When the obvious choice fails",
        "What your first instinct would say",
        questionWords.length > 0 ? `The ${questionWords[0]} version most people know` : "The version most people know",
        "A plausible-sounding technical term",
      ];
      
      // Pick a random template that hasn't been used yet
      let attempt = 0;
      let answer = "";
      while (attempt < 20) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        if (!existingAnswers.includes(template)) {
          answer = template;
          break;
        }
        attempt++;
      }
      
      // Fallback if all templates used
      if (!answer) {
        answer = `Alternative interpretation ${existingAnswers.length + 1}`;
      }
      
      return answer;
    };

    const existingTexts = room.answers.map((a) => a.text);

    // Fill up with AI or contextual fallbacks up to a minimum of 4 presented answers (excl. the correct one)
    while (room.answers.length < 4) {
      let candidate: string | null = null;

      // Prefer AI-generated fakes when key is available, otherwise use contextual fallback
      if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
        try {
          const aiText = await aiService.generateFakeAnswer(
            room.currentPrompt.questionText,
            room.currentPrompt.correctAnswer,
            existingTexts
          );

          // Optional moderation in family-safe rooms
          const moderated = room.familySafe
            ? moderationService.filterAnswer(aiText, true)
            : aiText;

          if (moderated && moderated.trim().length >= 3 && !existingTexts.includes(moderated)) {
            candidate = moderated.trim();
          }
        } catch (e) {
          // fall back below
        }
      }

      if (!candidate) {
        candidate = generateContextualFallback(
          room.currentPrompt.questionText,
          existingTexts
        );
      }

      // Ensure uniqueness and non-empty
      if (candidate && candidate.trim() && !existingTexts.includes(candidate)) {
        existingTexts.push(candidate);
        room.answers.push({
          id: randomUUID(),
          playerId: "AI",
          playerName: "AI",
          text: candidate,
          isCorrect: false,
          isAI: true,
          votedBy: [],
        });
      }
    }

    room.answers.push({
      id: randomUUID(),
      playerId: "CORRECT",
      playerName: "Correct",
      text: room.currentPrompt.correctAnswer,
      isCorrect: true,
      isAI: false,
      votedBy: [],
    });

    this.shuffleArray(room.answers);

    room.state = "vote";
    room.roundEndTime = Date.now() + room.settings.voteTime * 1000;

    await redisGameStore.saveRoom(room);

    if (this.onPhaseChange) {
      this.onPhaseChange(roomId, room);
    }

    console.log(`Room ${roomId} transitioned to vote phase with ${room.answers.length} answers`);

    // Make Mr Blooper vote after a delay
    this.scheduleMrBloopVote(roomId);

    // Only auto-advance if timer is set
    if (room.settings.voteTime > 0) {
      this.setTimer(roomId, () => this.autoAdvancePhase(roomId), room.settings.voteTime * 1000);
    }
  }

  private async scheduleMrBloopVote(roomId: string): Promise<void> {
    const { mrBloopService } = await import("./mrBloopService");
    const room = await redisGameStore.getRoom(roomId);
    if (!room || !mrBloopService.isInRoom(room) || room.state !== "vote") return;

    const delay = mrBloopService.getThinkingDelay();
    setTimeout(async () => {
      const currentRoom = await redisGameStore.getRoom(roomId);
      if (!currentRoom || currentRoom.state !== "vote") return;

      // Check if Mr Blooper already voted
      const mrBloopPlayer = currentRoom.players.find(p => mrBloopService.isMrBloop(p.id));
      if (!mrBloopPlayer) return;
      
      const hasVoted = currentRoom.votes.some(v => v.playerId === mrBloopPlayer.id);
      if (hasVoted) return;

      try {
        const answerId = mrBloopService.selectAnswerToVote(currentRoom);
        if (answerId) {
          await this.submitVote(roomId, mrBloopPlayer.id, answerId);
        }
      } catch (error) {
        console.error("Mr Blooper failed to vote:", error);
      }
    }, delay);
  }

  private async revealAnswers(roomId: string): Promise<void> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room) return;

    room.state = "reveal";
    room.roundEndTime = Date.now() + room.settings.revealTime * 1000;

    await redisGameStore.saveRoom(room);

    if (this.onPhaseChange) {
      this.onPhaseChange(roomId, room);
    }

    console.log(`Room ${roomId} transitioned to reveal phase`);

    setTimeout(async () => {
      const result = await this.showLeaderboard(roomId);
      if (result && this.onPhaseChange) {
        this.onPhaseChange(roomId, result.room, result.results);
      }
    }, room.settings.revealTime * 1000);
  }

  onPhaseChange?: (roomId: string, room: GameRoom, results?: RoundResult[]) => void;

  async showLeaderboard(roomId: string): Promise<{ room: GameRoom; results: RoundResult[] } | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room) return null;

    const results = scoringService.calculateRoundResults(room);
    const updatedRoom = scoringService.applyResults(room, results);

    updatedRoom.state = "leaderboard";
    delete updatedRoom.roundEndTime;

    await redisGameStore.saveRoom(updatedRoom);

    console.log(`Room ${roomId} transitioned to leaderboard phase`);
    return { room: updatedRoom, results };
  }

  private async autoAdvancePhase(roomId: string): Promise<void> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room) {
      console.log(`[autoAdvancePhase] Room ${roomId} not found`);
      return;
    }

    console.log(`[autoAdvancePhase] Auto-advancing room ${roomId} from state: ${room.state}`);

    if (room.state === "collect") {
      await this.prepareVoting(roomId);
    } else if (room.state === "vote") {
      await this.revealAnswers(roomId);
    }
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async updateSettings(
    roomId: string,
    settings: Partial<import("@shared/schema").GameSettings>
  ): Promise<GameRoom | null> {
    const room = await redisGameStore.getRoom(roomId);
    if (!room || room.state !== "lobby") {
      return null;
    }

    // Validate and clamp settings to prevent abuse
    if (settings.totalRounds !== undefined) {
      room.totalRounds = Math.max(1, Math.min(10, Math.floor(settings.totalRounds)));
    }
    if (settings.collectTime !== undefined) {
      room.settings.collectTime = Math.max(30, Math.min(300, Math.floor(settings.collectTime)));
    }
    if (settings.voteTime !== undefined) {
      room.settings.voteTime = Math.max(15, Math.min(180, Math.floor(settings.voteTime)));
    }
    if (settings.revealTime !== undefined) {
      room.settings.revealTime = Math.max(5, Math.min(30, Math.floor(settings.revealTime)));
    }
    if (settings.pointsCorrect !== undefined) {
      room.settings.pointsCorrect = Math.max(0, Math.min(10, Math.floor(settings.pointsCorrect)));
    }
    if (settings.pointsPerFool !== undefined) {
      room.settings.pointsPerFool = Math.max(0, Math.min(10, Math.floor(settings.pointsPerFool)));
    }
    if (settings.pointsFoolAll !== undefined) {
      room.settings.pointsFoolAll = Math.max(0, Math.min(10, Math.floor(settings.pointsFoolAll)));
    }
    if (settings.pointsTimeout !== undefined) {
      room.settings.pointsTimeout = Math.max(-5, Math.min(0, Math.floor(settings.pointsTimeout)));
    }

    await redisGameStore.saveRoom(room);
    return room;
  }

  private getRandomAvatar(): string {
    const avatars = ["🎭", "🎨", "🎮", "🎯", "🎲", "🎪", "🎸", "🎺", "🎻", "🎬"];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
}

export const gameEngine = new GameEngine();
