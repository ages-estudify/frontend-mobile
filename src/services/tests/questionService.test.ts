import { fetchQuestions, sendAnswer } from "../questionService";

global.fetch = jest.fn();

describe("questionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar questões da API corretamente usando fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          questions: [{ id: "1", text: "Q1" }],
          sessionProgress: { current: 0, total: 20 },
        },
      }),
    });

    const response = await fetchQuestions({ topicId: "1", type: "ORIGINAL" });

    expect(global.fetch).toHaveBeenCalled();
    expect(response.data).toBeTruthy();
  });

  it("deve enviar a resposta corretamente pela API usando fetch", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await expect(sendAnswer("1", "A")).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalled();
  });
});
