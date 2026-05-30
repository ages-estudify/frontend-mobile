import { useStreak } from "@/hooks/useStreak";
import { getQuestions, postAnswer } from "@/services/question.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useQuestionSession } from "../../hooks/useQuestionSession";

jest.mock("@/hooks/useStreak", () => ({
  useStreak: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    topicId: "topic-1",
    type: "ORIGINAL",
  }),
}));

jest.mock("@/services/question.service", () => ({
  getQuestions: jest.fn(),
  postAnswer: jest.fn(),
}));

const mockedUseStreak = useStreak as jest.Mock;

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
    mockedUseStreak.mockReturnValue({ updateStreak: jest.fn() });
  });

  it("deve carregar as questões iniciais e atualizar progresso", async () => {
    (getQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    const { result } = renderHook(() => useQuestionSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.question?.id).toBe("1");
    expect(result.current.progress.total).toBe(20);
  });

  it("deve chamar postAnswer e salvar feedback sem avançar o cursor", async () => {
    (getQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    const mockFeedback = {
      data: {
        isCorrect: true,
        comment: "Well done!",
        correctAnswer: "A",
        explanation: "ok",
        coinsEarned: 1,
        totalCoins: 5,
      },
    };

    (postAnswer as jest.Mock).mockResolvedValue(mockFeedback);

    const { result } = renderHook(() => useQuestionSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelected("A");
    });

    await act(async () => {
      await result.current.confirmAnswer();
    });

    expect(postAnswer).toHaveBeenCalledWith("1", "A");
    expect(mockedUseStreak().updateStreak).not.toHaveBeenCalled();

    expect(result.current.question?.id).toBe("1");
    expect(result.current.feedback).toEqual(mockFeedback.data);
    expect(result.current.progress.current).toBe(0);

    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.question?.id).toBe("2");
    expect(result.current.progress.current).toBe(1);
    expect(result.current.selected).toBeNull();
  });

  it("deve atualizar o streak quando a resposta retornar streakDays e streakActive", async () => {
    (getQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    const mockFeedback = {
      data: {
        isCorrect: true,
        correctAnswer: "A",
        explanation: "ok",
        coinsEarned: 1,
        totalCoins: 5,
        streakDays: 5,
        streakActive: true,
      },
    };

    (postAnswer as jest.Mock).mockResolvedValue(mockFeedback);

    const { result } = renderHook(() => useQuestionSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelected("A");
    });

    await act(async () => {
      await result.current.confirmAnswer();
    });

    expect(mockedUseStreak().updateStreak).toHaveBeenCalledWith({
      streakDays: 5,
      streakActive: true,
    });
  });

  it("deve salvar no AsyncStorage (Retry Offline) se postAnswer falhar", async () => {
    (getQuestions as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          questions: mockQuestions,
          sessionProgress: { current: 0, total: 20 },
        },
      })
      .mockResolvedValue({ data: null });

    (postAnswer as jest.Mock).mockRejectedValue(new Error("Sem internet"));

    const { result } = renderHook(() => useQuestionSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSelected("B");
    });

    await act(async () => {
      await result.current.confirmAnswer();
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "failedAnswers",
        expect.stringContaining('"questionId":"1"')
      );
    });
  });

  it("deve sinalizar isFinished quando não houver mais questões no backend", async () => {
    (getQuestions as jest.Mock).mockResolvedValue({ data: null });

    const { result } = renderHook(() => useQuestionSession());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isFinished).toBe(true);
  });
});
