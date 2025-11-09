import type { GameRoom, RoundResult, Answer } from "@shared/schema";

export class ScoringService {
  calculateRoundResults(room: GameRoom): RoundResult[] {
    const results: RoundResult[] = [];

    for (const player of room.players) {
      let points = 0;
      let reason: RoundResult["reason"] = "timeout";

      const playerVote = room.votes.find((v) => v.playerId === player.id);
      const playerAnswer = room.answers.find((a) => a.playerId === player.id);

      // Did they vote?
      if (playerVote) {
        const votedAnswer = room.answers.find((a) => a.id === playerVote.answerId);

        // Correct answer: use custom points
        if (votedAnswer?.isCorrect) {
          points += room.settings.pointsCorrect;
          reason = "correct";
        }
      } else {
        // No vote submitted: use custom timeout penalty
        points = room.settings.pointsTimeout;
        reason = "timeout";
      }

      const fooledPlayers: string[] = [];
      
      // Did their fake answer fool anyone?
      if (playerAnswer && !playerAnswer.isCorrect) {
        const fooledCount = playerAnswer.votedBy.length;

        if (fooledCount > 0) {
          fooledPlayers.push(...playerAnswer.votedBy);
          
          // Custom points per person fooled
          points += fooledCount * room.settings.pointsPerFool;
          reason = "fooled_others";

          // Bonus: fooled everyone who voted
          const totalVoters = room.votes.length;
          if (fooledCount === totalVoters && totalVoters > 0) {
            points += room.settings.pointsFoolAll;
            reason = "fooled_all";
          }
        }
      }

      results.push({
        playerId: player.id,
        playerName: player.name,
        points,
        reason,
        fooledPlayers: fooledPlayers.length > 0 ? fooledPlayers : undefined,
      });
    }

    return results;
  }

  applyResults(room: GameRoom, results: RoundResult[]): GameRoom {
    const updatedPlayers = room.players.map((player) => {
      const result = results.find((r) => r.playerId === player.id);
      if (result) {
        return {
          ...player,
          score: Math.max(0, player.score + result.points),
        };
      }
      return player;
    });

    return {
      ...room,
      players: updatedPlayers,
    };
  }
}

export const scoringService = new ScoringService();
