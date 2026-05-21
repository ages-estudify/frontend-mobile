import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ProgressOverviewCard } from "../../../src/components/Progress/ProgressOverviewCard";
import { ProgressSummaryCards } from "../../../src/components/Progress/ProgressSummaryCards";
import { GamificationMetrics } from "../../../src/components/Progress/GamificationMetrics";
import { SimuladosProgressSection } from "../../../src/components/Progress/SimuladosProgressSection";
import { AccuracyBySubjectSection } from "../../../src/components/Progress/AccuracyBySubjectSection";

// Mock para o expo-router do EmptySimuladosState
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Progress Components", () => {
  describe("ProgressOverviewCard", () => {
    it("renders correctly with full data", () => {
      const overview = { totalAnswered: 100, totalCorrect: 50, accuracyPercentage: 50 };
      const { getByText } = render(<ProgressOverviewCard overview={overview} />);
      expect(getByText("Progresso Geral")).toBeTruthy();
      expect(getByText("100")).toBeTruthy();
      expect(getByText("50")).toBeTruthy();
    });

    it("renders safely with zero or undefined data", () => {
      const { getByText, getAllByText } = render(<ProgressOverviewCard />);
      expect(getByText("Progresso Geral")).toBeTruthy();
      expect(getAllByText("0")).toHaveLength(2); // Questões e Corretas
    });
  });

  describe("ProgressSummaryCards", () => {
    it("renders accurately with data", () => {
      const level = { current: 5, max: 10 };
      const completedTopics = { completed: 2, total: 20 };
      const { getByText } = render(
        <ProgressSummaryCards
          level={level}
          completedTopics={completedTopics}
          accuracyPercentage={40}
        />
      );
      expect(getByText("5")).toBeTruthy();
      expect(getByText("/10")).toBeTruthy();
      expect(getByText("2")).toBeTruthy();
      expect(getByText("/20")).toBeTruthy();
      expect(getByText("40")).toBeTruthy();
    });

    it("handles undefined gracefully", () => {
      const { getAllByText } = render(<ProgressSummaryCards />);
      expect(getAllByText("0").length).toBeGreaterThan(0);
    });
  });

  describe("GamificationMetrics", () => {
    it("renders with given metrics", () => {
      const { getByText } = render(<GamificationMetrics stars={10} streak={5} />);
      expect(getByText("Estrelas: 10")).toBeTruthy();
      expect(getByText("Sequência de Dias: 5")).toBeTruthy();
    });

    it("renders default 0 values", () => {
      const { getByText } = render(<GamificationMetrics />);
      expect(getByText("Estrelas: 0")).toBeTruthy();
      expect(getByText("Sequência de Dias: 0")).toBeTruthy();
    });
  });

  describe("SimuladosProgressSection", () => {
    it("renders empty state when array is empty", () => {
      const { getByText } = render(<SimuladosProgressSection simulados={[]} />);
      expect(getByText("Você ainda não tem simulados")).toBeTruthy();
      expect(getByText("Começar Simulado")).toBeTruthy();
    });

    it("renders simulados list when data is available", () => {
      const mockSimulados = [
        {
          attemptId: "1",
          examName: "ENEM",
          date: "2026-01-01",
          days: [{ day: 1, label: "Dia 1", correct: 10, total: 20, scorePercentage: 50 }],
        },
      ];
      const { getByText } = render(<SimuladosProgressSection simulados={mockSimulados} />);
      expect(getByText("ENEM")).toBeTruthy();
      expect(getByText("Dia 1")).toBeTruthy();
      expect(getByText("50%")).toBeTruthy(); // inside CircularProgress
    });
  });

  describe("AccuracyBySubjectSection", () => {
    it("renders nothing if array is empty", () => {
      const { queryByText } = render(<AccuracyBySubjectSection subjects={[]} />);
      expect(queryByText("Acertos por Matéria")).toBeNull();
    });

    it("renders top 5 subjects and 'Ver tudo' button when more than 5", () => {
      const subjects = Array.from({ length: 6 }).map((_, i) => ({
        subjectId: `id-${i}`,
        subjectName: `Subject ${i}`,
        correct: 10,
        totalAnswered: 20,
      }));
      const { getByText, queryByText } = render(<AccuracyBySubjectSection subjects={subjects} />);

      expect(getByText("Subject 0")).toBeTruthy();
      expect(getByText("Subject 4")).toBeTruthy();
      expect(queryByText("Subject 5")).toBeNull(); // 6th is hidden

      const verTudo = getByText("Ver tudo");
      expect(verTudo).toBeTruthy();

      // Expands list
      fireEvent.press(verTudo);
      expect(getByText("Subject 5")).toBeTruthy();
      expect(getByText("Ver menos")).toBeTruthy();
    });
  });
});
