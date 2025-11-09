import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export class AIService {
  async generateFakeAnswer(
    questionText: string,
    correctAnswer: string,
    existingAnswers: string[]
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You generate a single bluff answer for a Psych-style party game. The answer must be plausible, human-sounding, and not the correct one. Constraints: 3–8 words, no quotes, minimal punctuation, avoid any words from the correct answer, avoid repeating existing answers, and keep it natural (casual but concise). Return ONLY the answer text.",
          },
          {
            role: "user",
            content: `Question: ${questionText}\nCorrect answer: ${correctAnswer}\nExisting fake answers: ${existingAnswers.join(", ")}\nOutput one human-like bluff answer that could trick players:`,
          },
        ],
        temperature: 0.9,
        max_tokens: 30,
      });

      const fakeAnswer = response.choices[0]?.message?.content?.trim() || "";
      return fakeAnswer.replace(/^["'\s]+|["'\s]+$/g, "").slice(0, 100);
    } catch (error) {
      console.error("AI Service error:", error);
      return this.getFallbackAnswer(questionText);
    }
  }

  private getFallbackAnswer(questionText: string): string {
    const fallbacks = [
      "Something mysterious and unexpected",
      "A clever trick that nobody knows",
      "The answer everyone always forgets",
      "What your teacher never told you",
      "The secret that changes everything",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const aiService = new AIService();
