import { FetchQuestionsResponse } from "@/types/Question";

const BASE_URL = "http://localhost:3000";

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
