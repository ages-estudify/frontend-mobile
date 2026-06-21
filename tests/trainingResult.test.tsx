import { getTrainingResult } from "@/services/question/question.service";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import TrainingResult from "../app/trainingResult";

const mockRouterReplace = jest.fn();
const mockRouter = {
  replace: mockRouterReplace,
};
const mockUseLocalSearchParams = jest.fn();

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useRouter: () => mockRouter,
}));

jest.mock("@/services/question/question.service", () => ({
  getTrainingResult: jest.fn(),
}));

jest.mock("../assets/icons/fire.svg", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/graphCard", () => {
  const { Text } = require("react-native");

  return function GraphCardMock({
    totalQuestions,
    correct,
    incorrect,
    blank,
    showBlank,
  }: {
    totalQuestions: number;
    correct: number;
    incorrect: number;
    blank: number;
    showBlank?: boolean;
  }) {
    return (
      <Text>
        GraphCard {totalQuestions} {correct} {incorrect} {blank} {String(showBlank)}
      </Text>
    );
  };
});

jest.mock("lucide-react-native", () => {
  const { Text } = require("react-native");

  return {
    Flame: () => <Text>Flame</Text>,
  };
});

function mockParams(params?: Partial<Record<string, string>>) {
  mockUseLocalSearchParams.mockReturnValue({
    questionIds: JSON.stringify(["uuid-1", "uuid-2", "uuid-3"]),
    sessionCoins: "18",
    streakDays: "6",
    streakActive: "true",
    ...params,
  });
}

describe("TrainingResult", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams();
  });

  it("chama o endpoint com questionIds em ordem e exibe resultado excelente", async () => {
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 4,
      correctAnswers: 3,
      wrongAnswers: 1,
    });

    const { getByText } = render(<TrainingResult />);

    expect(getByText("Carregando resultado...")).toBeTruthy();

    await waitFor(() => {
      expect(getTrainingResult).toHaveBeenCalledWith(["uuid-1", "uuid-2", "uuid-3"]);
    });

    expect(getByText("Excelente Desempenho!")).toBeTruthy();
    expect(getByText("GraphCard 4 3 1 0 false")).toBeTruthy();
  });

  it("exibe Bom Desempenho para taxa maior ou igual a 50% e menor que 75%", async () => {
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 4,
      correctAnswers: 2,
      wrongAnswers: 2,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Bom Desempenho!")).toBeTruthy();
    });
  });

  it("exibe Continue treinando para taxa menor que 50%", async () => {
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 4,
      correctAnswers: 1,
      wrongAnswers: 3,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Continue treinando!")).toBeTruthy();
    });
  });

  it("exibe moedas da sessao, streak atual e estado ativo", async () => {
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 2,
      correctAnswers: 1,
      wrongAnswers: 1,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Moedas ganhas: +18")).toBeTruthy();
    });

    expect(getByText("Streak atual: 6")).toBeTruthy();
    expect(getByText("Streak ativa")).toBeTruthy();
    expect(getByText("Ganhos desta sessão")).toBeTruthy();
  });

  it("exibe estado inativo da streak", async () => {
    mockParams({
      streakActive: "false",
      streakDays: "2",
    });
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 2,
      correctAnswers: 1,
      wrongAnswers: 1,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Streak atual: 2")).toBeTruthy();
    });

    expect(getByText("Streak inativa")).toBeTruthy();
  });

  it("botao Voltar navega para a tab Treinar", async () => {
    (getTrainingResult as jest.Mock).mockResolvedValue({
      totalQuestions: 2,
      correctAnswers: 1,
      wrongAnswers: 1,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Voltar")).toBeTruthy();
    });

    fireEvent.press(getByText("Voltar"));

    expect(mockRouterReplace).toHaveBeenCalledWith("/(tabs)/treinar");
  });

  it("erro 400 mostra mensagem de sessao invalida", async () => {
    (getTrainingResult as jest.Mock).mockRejectedValue({
      message: "Bad request",
      status: 400,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(
        getByText("Não foi possível carregar o resultado: sessão inválida ou incompleta")
      ).toBeTruthy();
    });
  });

  it("erro 401 redireciona para login", async () => {
    (getTrainingResult as jest.Mock).mockRejectedValue({
      message: "Unauthorized",
      status: 401,
    });

    render(<TrainingResult />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("erro 403 mostra mensagem de assinatura expirada", async () => {
    (getTrainingResult as jest.Mock).mockRejectedValue({
      message: "Forbidden",
      status: 403,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Sua assinatura expirou")).toBeTruthy();
    });
  });

  it("erro 404 mostra mensagem de questoes nao encontradas", async () => {
    (getTrainingResult as jest.Mock).mockRejectedValue({
      message: "Not found",
      status: 404,
    });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Algumas questões não foram encontradas")).toBeTruthy();
    });
  });

  it("erro fallback mostra mensagem generica", async () => {
    (getTrainingResult as jest.Mock).mockRejectedValue(new Error("network"));

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(getByText("Erro ao carregar resultado")).toBeTruthy();
    });
  });

  it("nao chama o endpoint quando questionIds estiver vazio", async () => {
    mockParams({ questionIds: JSON.stringify([]) });

    const { getByText } = render(<TrainingResult />);

    await waitFor(() => {
      expect(
        getByText("Não foi possível carregar o resultado: sessão inválida ou incompleta")
      ).toBeTruthy();
    });

    expect(getTrainingResult).not.toHaveBeenCalled();
  });
});
