import { FetchQuestionsResponse } from "@/types/Question";

const BASE_URL = "http://localhost:3000";
const USE_MOCK = true;
let mockCounter = 1;

type FetchParams = {
  topicId: string;
  type: "ORIGINAL" | "SIMPLIFIED";
  limit?: number;
  excludeAnswered?: boolean;
};

export async function fetchQuestions({
  topicId,
  type,
  limit = 10,
  excludeAnswered = true,
}: FetchParams): Promise<FetchQuestionsResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500)); // Loading

    if (mockCounter > 12) {
      return {
        data: null,
        message: "Todas as questões foram respondidas",
      };
    }

    const questions = Array.from({ length: 3 }).map(() => {
      const id = String(mockCounter++);

      return {
        id,
        text: `Pergunta mock ${id}`,
        type,
        alternatives: [
          { label: "A", text: "Opção A" },
          { label: "B", text: "Opção B" },
          { label: "C", text: "Opção C" },
          { label: "D", text: "Opção D" },
          { label: "E", text: "Opção E" },
        ],
      };
    });
    return {
      data: {
        questions,
        sessionProgress: {
          current: Math.min(mockCounter - 1, 12),
          total: 12,
        },
      },
    };
  }

  const url = new URL(`${BASE_URL}/api/questions/${topicId}`);

  url.searchParams.append("type", type);
  url.searchParams.append("limit", String(limit));
  url.searchParams.append("excludeAnswered", String(excludeAnswered));

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Erro ao buscar questões");
  }

  const data = await response.json();

  return data;
}

export async function sendAnswer(questionId: string, answer: string) {
  if (USE_MOCK) {
    console.log("Mock enviado: ", questionId, answer);
    return;
  }

  const response = await fetch(
    `${BASE_URL}/api/questions/${questionId}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer }),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao enviar resposta");
  }
}
