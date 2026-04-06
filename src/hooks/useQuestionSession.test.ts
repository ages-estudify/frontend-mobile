import { fetchQuestions, sendAnswer } from "@/services/questionService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useQuestionSession } from "./useQuestionSession";

jest.mock("@/services/questionService", () => ({
  fetchQuestions: jest.fn(),
  sendAnswer: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const mockQuestions = [
  {
    id: "1",
    text: "Q1",
    type: "ORIGINAL",
    foreing: false,
    subjectName: "A",
    topicName: "B",
    alternatives: [],
  },
  {
    id: "2",
    text: "Q2",
    type: "ORIGINAL",
    foreing: false,
    subjectName: "A",
    topicName: "B",
    alternatives: [],
  },
  {
    id: "3",
    text: "Q3",
    type: "ORIGINAL",
    foreing: false,
    subjectName: "A",
    topicName: "B",
    alternatives: [],
  },
];

describe("useQuestionSession Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve carregar as questões iniciais e atualizar progresso", async () => {
    (fetchQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    const { result } = renderHook(() =>
      useQuestionSession("topic-1", "ORIGINAL")
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.question?.id).toBe("1");
    expect(result.current.progress.total).toBe(20);
  });

  it("deve chamar sendAnswer e avançar o cursor ao confirmar", async () => {
    (fetchQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });
    (sendAnswer as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useQuestionSession("topic-1", "ORIGINAL")
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelected("A");
    });

    const onSuccessMock = jest.fn();

    await act(async () => {
      result.current.confirmAnswer(onSuccessMock);
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(sendAnswer).toHaveBeenCalledWith("1", "A");
    expect(result.current.question?.id).toBe("2");
    expect(result.current.selected).toBeNull();
    expect(result.current.progress.current).toBe(1);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
  });

  it("deve salvar no AsyncStorage (Retry Offline) se sendAnswer falhar", async () => {
    (fetchQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    (sendAnswer as jest.Mock).mockRejectedValue(new Error("Sem internet"));

    const { result } = renderHook(() =>
      useQuestionSession("topic-1", "ORIGINAL")
    );
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelected("B");
    });

    await act(async () => {
      result.current.confirmAnswer();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "failedAnswers",
        expect.stringContaining('"questionId":"1"')
      );
    });
  });

  it("deve sinalizar isFinished quando não houver mais questões no backend", async () => {
    (fetchQuestions as jest.Mock).mockResolvedValue({ data: null });

    const { result } = renderHook(() =>
      useQuestionSession("topic-1", "ORIGINAL")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isFinished).toBe(true);
  });
});
