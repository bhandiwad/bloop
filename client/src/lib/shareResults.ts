import type { GameRoom } from "@shared/schema";

export function generateShareableResults(room: GameRoom): string {
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  
  const lines: string[] = [
    "BLOOP GAME RESULTS",
    "",
    `Final Standings (${room.totalRounds} rounds):`,
    "",
  ];

  sortedPlayers.forEach((player, index) => {
    const prefix = index === 0 ? "[WINNER]" : index === 1 ? "[2nd]" : index === 2 ? "[3rd]" : "";
    const indexStr = `${index + 1}.`.padEnd(3);
    lines.push(`${prefix ? prefix + " " : ""}${indexStr} ${player.name} - ${player.score} points`);
  });

  lines.push("");
  lines.push(`Champion: ${winner.name} with ${winner.score} points!`);
  lines.push("");
  lines.push("Play Bloop - The party game where you fool your friends!");

  return lines.join("\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
