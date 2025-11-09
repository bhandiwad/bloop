import { aiService } from "./aiService";
import type { GameRoom, Player } from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * Mr Blooper - AI player service
 * Generates contextual answers and votes like a real player
 */
class MrBloopService {
  private readonly MR_BLOOP_ID = "mr-bloop-ai";
  private readonly MR_BLOOP_NAME = "Mr Blooper";
  private readonly MR_BLOOP_AVATAR = "wizard"; // Doctor Strange avatar

  /**
   * Create Mr Blooper as a player
   */
  createMrBloop(): Player {
    return {
      id: this.MR_BLOOP_ID,
      name: this.MR_BLOOP_NAME,
      isHost: false,
      avatar: this.MR_BLOOP_AVATAR,
      score: 0,
      connected: true,
      ready: false,
      submitted: false,
    };
  }

  /**
   * Check if a player is Mr Blooper
   */
  isMrBloop(playerId: string): boolean {
    return playerId === this.MR_BLOOP_ID;
  }

  /**
   * Check if Mr Blooper is in the room
   */
  isInRoom(room: GameRoom): boolean {
    return room.players.some(p => this.isMrBloop(p.id));
  }

  /**
   * Generate a clever fake answer for Mr Blooper
   */
  async generateAnswer(
    question: string,
    correctAnswer: string,
    existingAnswers: string[]
  ): Promise<string> {
    // If OpenAI is available, use it for clever answers
    if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
      try {
        const response = await aiService.generateFakeAnswer(question, correctAnswer, existingAnswers);
        return response;
      } catch (error) {
        console.error("Mr Blooper AI generation failed, using fallback:", error);
      }
    }

    // Fallback: Generate contextual fake answer
    return this.generateFallbackAnswer(question, correctAnswer, existingAnswers);
  }

  /**
   * Generate a fallback answer when AI is not available
   */
  private generateFallbackAnswer(
    question: string,
    correctAnswer: string,
    existingAnswers: string[]
  ): string {
    const questionLower = question.toLowerCase();
    
    // Extract key words from question
    const keyWords = questionLower
      .replace(/[?'"]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['what', 'does', 'where', 'when', 'which', 'describe', 'mean', 'about'].includes(word));

    const templates = [
      `something involving ${keyWords[0] || 'the subject'} incorrectly`,
      `a common misconception about ${keyWords[0] || 'this topic'}`,
      `what most people think but is actually wrong`,
      `the obvious answer that's actually incorrect`,
      `a plausible-sounding but fake explanation`,
      `what it seems like at first glance`,
      `the popular but incorrect theory`,
      `a believable alternative explanation`,
    ];

    // Pick a random template that hasn't been used
    let attempt = 0;
    while (attempt < 20) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      if (!existingAnswers.includes(template)) {
        return template;
      }
      attempt++;
    }

    return `Mr Blooper's clever alternative answer ${existingAnswers.length + 1}`;
  }

  /**
   * Make Mr Blooper vote for an answer
   * Strategy: Avoid correct answer, prefer answers from real players
   */
  selectAnswerToVote(room: GameRoom): string | null {
    if (!room.currentPrompt) return null;

    const availableAnswers = room.answers.filter(a => 
      !this.isMrBloop(a.playerId) && // Don't vote for own answer
      !a.isCorrect // Try to avoid correct answer (but might vote for it sometimes)
    );

    if (availableAnswers.length === 0) {
      // If no other answers, vote for any non-self answer
      const anyAnswer = room.answers.find(a => !this.isMrBloop(a.playerId));
      return anyAnswer?.id || null;
    }

    // 70% chance to vote for a player's fake answer
    // 30% chance to accidentally vote for correct answer
    const shouldVoteCorrect = Math.random() < 0.3;
    
    if (shouldVoteCorrect) {
      const correctAnswer = room.answers.find(a => a.isCorrect);
      if (correctAnswer) return correctAnswer.id;
    }

    // Vote for a random player answer
    const randomIndex = Math.floor(Math.random() * availableAnswers.length);
    return availableAnswers[randomIndex].id;
  }

  /**
   * Simulate Mr Blooper's thinking time (random delay)
   */
  getThinkingDelay(): number {
    // Random delay between 3-8 seconds to seem human-like
    return 3000 + Math.random() * 5000;
  }

  /**
   * Set Mr Blooper as ready
   */
  setReady(room: GameRoom): void {
    const mrBloop = room.players.find(p => this.isMrBloop(p.id));
    if (mrBloop) {
      mrBloop.ready = true;
    }
  }
}

export const mrBloopService = new MrBloopService();
