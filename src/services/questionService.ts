import { FetchQuestionsResponse } from "@/types/Question";

const BASE_URL = "http://localhost:3000";
const USE_MOCK = true;
let mockNextId = 1;
let mockAnsweredCount = 0;

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
    await new Promise((r) => setTimeout(r, 500)); // Simulando loading

    if (mockNextId > 20) {
      return {
        data: null,
      };
    }

    // Calcula questões que o mock deve gerar
    // Se pedir o limit (10), e ainda faltar 20, gera 10
    // Se faltar só 2, gera só 2.
    const questionsToGenerate = Math.min(limit, 20 - mockNextId + 1);

    const questions = Array.from({ length: questionsToGenerate }).map(() => {
      const id = String(mockNextId++);

      return {
        id,
        text: `Mock ${id} - Leia o texto abaixo:
        A Revolução Industrial foi um período de grandes transformações econômicas e sociais, que teve início na Inglaterra no século XVIII. Esse processo marcou a transição de uma economia agrária para uma economia industrializada, baseada na mecanização da produção e no uso intensivo de energia.
        Com o avanço das tecnologias, houve um aumento significativo na produção de bens, o que contribuiu para o crescimento das cidades e a formação de uma nova classe trabalhadora urbana. No entanto, também surgiram diversos problemas sociais, como jornadas de trabalho exaustivas, baixos salários e condições precárias nas fábricas.
        Considerando o contexto apresentado, assinale a alternativa correta sobre os impactos da Revolução Industrial:`,
        type,
        foreing: true,
        subjectName: "História",
        topicName: "Contemporânea",
        alternatives: [
          {
            label: "A",
            text: "Opção A - Texto grande para visualização de resposta grande",
          },
          {
            label: "B",
            text: "Opção B - Texto grande para visualização de resposta grande",
          },
          {
            label: "C",
            text: "Opção C - Texto grande para visualização de resposta grande",
          },
          {
            label: "D",
            text: "Opção D - Texto grande para visualização de resposta grande",
          },
          {
            label: "E",
            text: "Opção E - Texto grande para visualização de resposta grande",
          },
        ],
      };
    });
    return {
      data: {
        questions,
        sessionProgress: {
          current: mockAnsweredCount,
          total: 20,
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
    console.log("Mock enviado: ", questionId, "-", answer);
    mockAnsweredCount++;
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
