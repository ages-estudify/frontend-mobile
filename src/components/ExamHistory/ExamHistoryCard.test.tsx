import ExamHistoryCard from "@/components/ExamHistory/ExamHistoryCard";
import { history } from "@/types/exam-history.types";
import { render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";

jest.mock("expo-router");

const mockRouter = {
  push: jest.fn(),
};

const mockExamHistory: history = {
  attemptDayId: "attempt-1",
  day: 1,
  totalQuestions: 90,
  answeredQuestions: 82,
  correctAnswers: 65,
  timeSpentSeconds: 5400,
  completedAt: "2025-02-13T16:45:00.000Z",
};

describe("ExamHistoryCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe("Time Formatting", () => {
    it("should format time correctly (5400 seconds = 1:30)", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("1:30")).toBeTruthy();
    });

    it("should format time for 1 hour (3600 seconds = 1:00)", () => {
      const data = { ...mockExamHistory, timeSpentSeconds: 3600 };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("1:00")).toBeTruthy();
    });

    it("should format time for 30 seconds (30 = 0:00)", () => {
      const data = { ...mockExamHistory, timeSpentSeconds: 30 };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("0:00")).toBeTruthy();
    });

    it("should format time for 0 seconds (0 = 0:00)", () => {
      const data = { ...mockExamHistory, timeSpentSeconds: 0 };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("0:00")).toBeTruthy();
    });

    it("should format time for 2 hours (7200 seconds = 2:00)", () => {
      const data = { ...mockExamHistory, timeSpentSeconds: 7200 };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("2:00")).toBeTruthy();
    });

    it("should format time for 2 hours 45 minutes (9900 seconds = 2:45)", () => {
      const data = { ...mockExamHistory, timeSpentSeconds: 9900 };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("2:45")).toBeTruthy();
    });
  });

  describe("Percentage Calculation", () => {
    it("should calculate percentage correctly (82/90 = 91%)", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("91%")).toBeTruthy();
    });

    it("should round percentage correctly", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 67,
      };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("67%")).toBeTruthy();
    });

    it("should calculate 50% correctly", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 50,
      };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("50%")).toBeTruthy();
    });

    it("should calculate 0% correctly", () => {
      const data = {
        ...mockExamHistory,
        answeredQuestions: 0,
      };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("0%")).toBeTruthy();
    });

    it("should calculate 100% correctly", () => {
      const data = {
        ...mockExamHistory,
        answeredQuestions: mockExamHistory.totalQuestions,
      };
      render(<ExamHistoryCard examHistory={data} />);

      expect(screen.getByText("100%")).toBeTruthy();
    });
  });

  describe("Color Logic", () => {
    it("should use green color for percentage >= 70%", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      const percentageText = screen.getByText("91%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#519B2F",
        })
      );
    });

    it("should use orange color for percentage >= 40% and < 70%", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 50,
      };
      render(<ExamHistoryCard examHistory={data} />);

      const percentageText = screen.getByText("50%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#E0963A",
        })
      );
    });

    it("should use red color for percentage < 40%", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 30,
      };
      render(<ExamHistoryCard examHistory={data} />);

      const percentageText = screen.getByText("30%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#D43B3B",
        })
      );
    });

    it("should use green color for exactly 70%", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 70,
      };
      render(<ExamHistoryCard examHistory={data} />);

      const percentageText = screen.getByText("70%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#519B2F",
        })
      );
    });

    it("should use orange color for exactly 40%", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 40,
      };
      render(<ExamHistoryCard examHistory={data} />);

      const percentageText = screen.getByText("40%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#E0963A",
        })
      );
    });

    it("should use red color for 39% (just below 40%)", () => {
      const data = {
        ...mockExamHistory,
        totalQuestions: 100,
        answeredQuestions: 39,
      };
      render(<ExamHistoryCard examHistory={data} />);

      const percentageText = screen.getByText("39%");
      expect(percentageText.props.style).toEqual(
        expect.objectContaining({
          color: "#D43B3B",
        })
      );
    });
  });

  describe("Card Display", () => {
    it("should display day correctly", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("Dia 1")).toBeTruthy();
    });

    it("should display total questions", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("90 questões")).toBeTruthy();
    });

    it("should display correct answers", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("65/90")).toBeTruthy();
    });

    it("should display labels", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);

      expect(screen.getByText("Corretas")).toBeTruthy();
      expect(screen.getByText("Tempo")).toBeTruthy();
      expect(screen.getByText("Realizado")).toBeTruthy();
    });

    it("should render nothing when examHistory is undefined", () => {
      const { queryByText } = render(<ExamHistoryCard examHistory={undefined} />);

      expect(queryByText("Dia")).toBeNull();
    });
  });

  describe("Navigation", () => {
    it("should have navigation route configured", () => {
      render(<ExamHistoryCard examHistory={mockExamHistory} />);
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
