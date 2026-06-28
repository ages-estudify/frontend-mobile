import api from "../api";
import { getQuestions, getTrainingResult, postAnswer } from "./question.service";

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
  handleApiError: jest.fn((error: any) => {
    throw error;
  }),
}));

describe("questionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar questoes da API corretamente", async () => {
    const mockData = {
      data: {
        questions: [{ id: "1", text: "Q1", type: "ORIGINAL", imageUrl: null }],
        sessionProgress: { current: 0, total: 20 },
      },
    };

    (api.get as jest.Mock).mockResolvedValueOnce(mockData);

    const response = await getQuestions({ topicId: "1", type: "ORIGINAL" });

    expect(api.get).toHaveBeenCalledWith("/questions/1", {
      params: {
        type: "ORIGINAL",
        limit: 10,
        excludeAnswered: true,
        retrieveWrong: true,
      },
    });
    expect(response).toEqual(mockData);
  });

  it("deve enviar a resposta e retornar gabarito corretamente", async () => {
    const mockFeedback = {
      data: {
        isCorrect: true,
        correctAnswer: "A",
        explanation: "Explicacao tecnica da resposta",
        coinsEarned: 10,
        totalCoins: 100,
      },
    };

    (api.post as jest.Mock).mockResolvedValueOnce(mockFeedback);

    const response = await postAnswer("1", "A");

    expect(api.post).toHaveBeenCalledWith("/questions/1/answer", {
      selectedAnswer: "A",
    });

    expect(response).toEqual(mockFeedback);
  });

  it("deve lancar erro se a postagem da resposta falhar", async () => {
    const error = new Error("Erro ao enviar resposta");
    (api.post as jest.Mock).mockRejectedValueOnce(error);

    await expect(postAnswer("1", "A")).rejects.toThrow("Erro ao enviar resposta");
  });

  it("deve buscar o resultado do treino enviando questionIds em ordem", async () => {
    const mockResult = {
      totalQuestions: 3,
      correctAnswers: 2,
      wrongAnswers: 1,
    };

    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResult });

    const response = await getTrainingResult(["uuid-1", "uuid-2", "uuid-3"]);

    expect(api.post).toHaveBeenCalledWith("/questions/training/result", {
      questionsIds: ["uuid-1", "uuid-2", "uuid-3"],
    });
    expect(response).toEqual(mockResult);
  });
});
