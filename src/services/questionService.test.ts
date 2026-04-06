import { fetchQuestions, sendAnswer } from "./questionService";

describe("questionService", () => {
  it("deve retornar questões usando o mock interno do serviço", async () => {
    const response = await fetchQuestions({ topicId: "1", type: "ORIGINAL" });
    expect(response.data).toBeTruthy();
    expect(response.data?.questions.length).toBeGreaterThan(0);
  });

  it("deve simular o envio de resposta e incrementar o mock", async () => {
    await expect(sendAnswer("1", "A")).resolves.toBeUndefined();
  });
});
