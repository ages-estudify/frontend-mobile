import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import {
  getAttemptDayResult,
  getExamResultGrid,
} from "@/services/examFeedback/examFeedback.service";
import ExamFeedback from "../app/examFeedback";

const mockRouterReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn(() => ({
  attemptDayId: "attempt-day-id",
  type: "simulado",
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useRouter: jest.fn(() => ({
    replace: mockRouterReplace,
  })),
}));

jest.mock("@/services/examFeedback/examFeedback.service", () => ({
  getAttemptDayResult: jest.fn(),
  getExamResultGrid: jest.fn(),
}));

jest.mock("@/components/graphCard", () => {
  const { Text } = require("react-native");

  return function GraphCardMock({
    totalQuestions,
    correct,
    incorrect,
    blank,
  }: {
    totalQuestions: number;
    correct: number;
    incorrect: number;
    blank: number;
  }) {
    return (
      <Text>
        GraphCard {totalQuestions} {correct} {incorrect} {blank}
      </Text>
    );
  };
});

jest.mock("@/components/QuestionFeedbackButton", () => {
  const { Text } = require("react-native");

  return function QuestionFeedbackButtonMock({
    number,
    feedback,
    ghost,
  }: {
    number: number;
    feedback: string;
    ghost?: boolean;
  }) {
    if (ghost) {
      return <Text>Ghost</Text>;
    }

    return (
      <Text>
        Question {number} {feedback}
      </Text>
    );
  };
});

jest.mock("lucide-react-native", () => {
  const { Text } = require("react-native");

  return {
    X: () => <Text>X</Text>,
  };
});

describe("ExamFeedback", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({
      attemptDayId: "attempt-day-id",
      type: "simulado",
    });

    (getAttemptDayResult as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        attemptDayId: "attempt-day-id",
        attemptId: "attempt-id",
        examId: "exam-id",
        examDayId: "exam-day-id",
        name: "Simulado ENEM",
        day: 1,
        timeSpentSeconds: 5400,
        endTime: "2026-05-03T00:00:00.000Z",
        totalQuestions: 10,
        answeredQuestions: 10,
        correctAnswers: 7,
        wrongAnswers: 2,
        blankAnswers: 1,
      },
    });

    (getExamResultGrid as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        attemptId: "attempt-id",
        totalQuestions: 3,
        grid: [
          {
            questionId: "question-1",
            number: 1,
            status: "CORRECT",
          },
          {
            questionId: "question-2",
            number: 2,
            status: "WRONG",
          },
          {
            questionId: "question-3",
            number: 3,
            status: "BLANK",
          },
        ],
      },
    });
  });

  it("should load result data using attemptDayId", async () => {
    const { getByText } = render(<ExamFeedback />);

    await waitFor(() => {
      expect(getAttemptDayResult).toHaveBeenCalledWith("attempt-day-id");
    });

    expect(getByText("Resultados Simulado")).toBeTruthy();
    expect(getByText("Excelente desempenho!")).toBeTruthy();
    expect(getByText("GraphCard 10 7 2 1")).toBeTruthy();
    expect(getByText("01:30")).toBeTruthy();
  });

  it("should load result grid using attemptId returned by result route", async () => {
    const { getByText } = render(<ExamFeedback />);

    await waitFor(() => {
      expect(getExamResultGrid).toHaveBeenCalledWith("attempt-id", "ALL", "attempt-day-id");
    });

    expect(getByText("Question 1 Correct")).toBeTruthy();
    expect(getByText("Question 2 Incorrect")).toBeTruthy();
    expect(getByText("Question 3 Blank")).toBeTruthy();
  });

  it("should request filtered grid when selecting correct answers", async () => {
    const { getByText } = render(<ExamFeedback />);

    await waitFor(() => {
      expect(getExamResultGrid).toHaveBeenCalledWith("attempt-id", "ALL", "attempt-day-id");
    });

    fireEvent.press(getByText("Corretas"));

    await waitFor(() => {
      expect(getExamResultGrid).toHaveBeenCalledWith("attempt-id", "CORRECT", "attempt-day-id");
    });
  });

  it("should show stars when type is treino", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      attemptDayId: "attempt-day-id",
      type: "treino",
    });

    const { getByText } = render(<ExamFeedback />);

    await waitFor(() => {
      expect(getByText("+7")).toBeTruthy();
    });

    expect(getByText("Estrelas")).toBeTruthy();
  });

  it("should redirect to simulado tab when pressing close button on a simulado feedback", async () => {
    const { getByText } = render(<ExamFeedback />);

    fireEvent.press(getByText("X"));

    expect(mockRouterReplace).toHaveBeenCalledWith("/(tabs)/simulado");
  });
});
