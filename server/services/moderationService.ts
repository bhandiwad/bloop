export class ModerationService {
  private blocklist = [
    // Basic profanity filter
    "damn",
    "hell",
    "ass",
    "shit",
    "fuck",
    "bitch",
    "bastard",
    "crap",
  ];

  moderateText(text: string, familySafe: boolean): { safe: boolean; filtered: string } {
    if (!familySafe) {
      return { safe: true, filtered: text };
    }

    // Check with word boundaries to avoid matching substrings inside clean words
    let hasProfanity = this.blocklist.some((w) => {
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");
      return pattern.test(text);
    });

    if (hasProfanity) {
      return { safe: false, filtered: text };
    }

    return { safe: true, filtered: text };
  }

  filterAnswer(answer: string, familySafe: boolean): string | null {
    const result = this.moderateText(answer, familySafe);
    return result.safe ? result.filtered : null;
  }
}

export const moderationService = new ModerationService();
