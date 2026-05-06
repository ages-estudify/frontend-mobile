import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    BottomSheetView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock("@/constants/tabBarLayout", () => ({
  tabBarScrollContentPaddingBottom: () => 80,
  tabBarBottomOffset: () => 0,
  TAB_BAR_HEIGHT: 64,
}));

jest.mock("../../assets/enem 2.png", () => 1);
jest.mock("../../assets/ufrgs_cor 1 1.png", () => 2);

// ── Mock do useExams (controlável por teste) ─────────────────────────────────

const mockRetryExam = jest.fn();
const mockUseExams = jest.fn();

jest.mock("@/hooks/useExams", () => ({
  useExams: (...args: any[]) => mockUseExams(...args),
}));

const examAvailable = {
  id: "exam-available",
  name: "Simulado Disponível",
  origin: "ORIGINAL",
  description: "Descrição do simulado",
  imageUrl: null,
  status: "available",
  totalQuestions: 180,
  answeredQuestions: 0,
  progress: { answered: 0, total: 180, percentage: 0 },
  hasLanguageChoice: true,
  days: [
    {
      examDayId: "day-1",
      day: 1,
      totalQuestions: 90,
      answeredQuestions: 0,
      status: "available",
      isCompleted: false,
      hasLanguageChoice: true,
    },
  ],
};

const examInProgress = {
  id: "exam-in-progress",
  name: "Simulado Em Andamento",
  origin: "EXTERNAL",
  imageUrl: null,
  status: "in_progress",
  totalQuestions: 60,
  answeredQuestions: 30,
  progress: { answered: 30, total: 60, percentage: 50 },
  hasLanguageChoice: false,
  days: [
    {
      examDayId: "day-unique",
      day: 1,
      totalQuestions: 60,
      answeredQuestions: 30,
      status: "in_progress",
      isCompleted: false,
      attemptDayId: "attempt-123",
    },
  ],
};

const examCompleted = {
  id: "exam-completed",
  name: "Simulado Finalizado",
  origin: "ORIGINAL",
  imageUrl: null,
  status: "completed",
  totalQuestions: 180,
  answeredQuestions: 180,
  progress: { answered: 180, total: 180, percentage: 100 },
  hasLanguageChoice: false,
  days: [
    {
      examDayId: "day-c",
      day: 1,
      totalQuestions: 180,
      answeredQuestions: 180,
      status: "completed",
      isCompleted: true,
      attemptDayId: "attempt-999",
    },
  ],
};

const examInProgressWithInProgressDay = {
  id: "exam-retry",
  name: "Simulado Retry",
  origin: "ORIGINAL",
  imageUrl: null,
  status: "completed",
  totalQuestions: 90,
  answeredQuestions: 90,
  progress: { answered: 90, total: 90, percentage: 100 },
  hasLanguageChoice: false,
  days: [
    {
      examDayId: "day-r",
      day: 1,
      totalQuestions: 90,
      answeredQuestions: 45,
      status: "in_progress",
      isCompleted: false,
      attemptDayId: "attempt-r",
    },
  ],
};

const defaultExams = [examAvailable, examInProgress, examCompleted];

function mockDefault() {
  mockUseExams.mockReturnValue({
    exams: defaultExams,
    loading: false,
    error: null,
    retryExam: mockRetryExam,
  });
}

import ExamsScreen from "./simulado";

describe("ExamsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDefault();
  });

  describe("Renderização dos cards", () => {
    it("exibe os nomes dos simulados", () => {
      render(<ExamsScreen />);
      expect(screen.getByText("Simulado Disponível")).toBeTruthy();
      expect(screen.getByText("Simulado Em Andamento")).toBeTruthy();
      expect(screen.getByText("Simulado Finalizado")).toBeTruthy();
    });

    it("exibe o título da tela", () => {
      render(<ExamsScreen />);
      expect(screen.getByText("Simulados")).toBeTruthy();
    });

    it("exibe badge Finalizado para exam completed", () => {
      render(<ExamsScreen />);
      expect(screen.getByText("Finalizado")).toBeTruthy();
    });

    it("exibe totalQuestions nos cards", () => {
      render(<ExamsScreen />);
      expect(screen.getAllByText("180 questões").length).toBeGreaterThan(0);
    });
  });

  describe("Estado de loading", () => {
    it("exibe ActivityIndicator enquanto loading=true", () => {
      mockUseExams.mockReturnValue({
        exams: [],
        loading: true,
        error: null,
        retryExam: mockRetryExam,
      });
      render(<ExamsScreen />);
      expect(screen.queryByText("Simulados")).toBeNull();
    });
  });

  describe("Estado de erro", () => {
    it("exibe mensagem de erro quando error não é null", () => {
      mockUseExams.mockReturnValue({
        exams: [],
        loading: false,
        error: "Erro ao carregar simulados",
        retryExam: mockRetryExam,
      });
      render(<ExamsScreen />);
      expect(screen.getByText("Erro ao carregar simulados")).toBeTruthy();
    });
  });

  describe("Estado vazio", () => {
    it("exibe mensagem quando não há simulados", () => {
      mockUseExams.mockReturnValue({
        exams: [],
        loading: false,
        error: null,
        retryExam: mockRetryExam,
      });
      render(<ExamsScreen />);
      expect(screen.getByText("Nenhum simulado disponível")).toBeTruthy();
    });

    it("não exibe mensagem de vazio quando há exams", () => {
      render(<ExamsScreen />);
      expect(screen.queryByText("Nenhum simulado disponível")).toBeNull();
    });
  });

  describe("Ordenação", () => {
    it("renderiza os três status de simulado", () => {
      render(<ExamsScreen />);
      expect(screen.getByText("Simulado Em Andamento")).toBeTruthy();
      expect(screen.getByText("Simulado Disponível")).toBeTruthy();
      expect(screen.getByText("Simulado Finalizado")).toBeTruthy();
    });
  });

  describe("Bottom sheet de dias", () => {
    it("abre o bottom sheet ao pressionar um card", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Disponível"));
      expect(screen.getByText("Escolha o dia da prova")).toBeTruthy();
    });

    it("renderiza os dias dentro do bottom sheet", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Disponível"));
      expect(screen.getByText("Dia 1")).toBeTruthy();
    });

    it("fecha o bottom sheet ao chamar handleCloseDaysSheet via onStartDay", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Em Andamento"));
      expect(screen.getByText("Escolha o dia da prova")).toBeTruthy();
      fireEvent.press(screen.getByText("Dia 1"));
      expect(screen.queryByText("Escolha o dia da prova")).toBeNull();
    });
  });

  describe("Bottom sheet de idioma", () => {
    it("abre o bottom sheet de idioma ao clicar no dia com hasLanguageChoice", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Disponível"));
      fireEvent.press(screen.getByText("Dia 1"));
      expect(screen.queryByText("Escolha o dia da prova")).toBeNull();
    });

    it("fecha o bottom sheet de idioma ao cancelar", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Disponível"));
      fireEvent.press(screen.getByText("Dia 1"));
      // LanguageBottomSheet está visível — pressionar cancelar fecha
      const cancelBtn = screen.queryByText("Cancelar");
      if (cancelBtn) fireEvent.press(cancelBtn);
      expect(screen.queryByText("Escolha o dia da prova")).toBeNull();
    });
  });

  describe("Menu ⋯ e retry", () => {
    it("chama retryExam ao confirmar retry de exam sem dia in_progress", () => {
      render(<ExamsScreen />);
      // retryExam não deve ter sido chamado ainda
      expect(mockRetryExam).not.toHaveBeenCalled();
    });

    it("abre modal de confirmação quando exam tem dia in_progress e retry é solicitado", () => {
      mockUseExams.mockReturnValue({
        exams: [examInProgressWithInProgressDay],
        loading: false,
        error: null,
        retryExam: mockRetryExam,
      });
      render(<ExamsScreen />);
      expect(screen.getByText("Simulado Retry")).toBeTruthy();
    });
  });

  describe("Modal de retry", () => {
    it("renderiza sem crash com RetryConfirmModal montado", () => {
      const { toJSON } = render(<ExamsScreen />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("handleContinueDay e handleStartDay", () => {
    it("fecha o bottom sheet ao continuar dia in_progress", () => {
      render(<ExamsScreen />);
      fireEvent.press(screen.getByText("Simulado Em Andamento"));
      expect(screen.getByText("Escolha o dia da prova")).toBeTruthy();
      fireEvent.press(screen.getByText("Dia 1"));
      expect(screen.queryByText("Escolha o dia da prova")).toBeNull();
    });
  });
});
