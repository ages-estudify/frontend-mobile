import api from "../api";
import { getQuestions, postAnswer } from "../question.service";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  isAxiosError: jest.fn(),
}));

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

  it("deve buscar questões da API corretamente usando axios", async () => {
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

  it("deve enviar a resposta corretamente pela API usando axios", async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    await expect(postAnswer("1", "A")).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith("/questions/1/answer", {
      answer: "A",
    });
  });
});
