import { useQuestionSession } from "@/hooks/useQuestionSession";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import QuestionScreen from "../app/question";

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

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("../assets/icons/back_arrow.svg", () => ({
  __esModule: true,
  default: () => null,
  ReactComponent: () => null,
}));

jest.mock("../assets/icons/expand.svg", () => ({
  __esModule: true,
  default: () => null,
  ReactComponent: () => null,
}));

jest.mock("@/hooks/useQuestionSession");

jest.mock("@gorhom/bottom-sheet", () => "MockBottomSheet");

jest.mock("@/components/QuestionAnalysisBottomSheet", () => ({
  QuestionAnalysisBottomSheet: "MockQuestionAnalysisBottomSheet",
}));

const mockQuestion = {
  id: "uuid-123",
  text: "Qual é o objetivo da fotossíntese?",
  imageUrl: null,
  type: "ORIGINAL",
  foreign: false,
  subjectName: "Biologia",
  topicName: "Botânica",
  alternatives: [
    { label: "A", text: "Gerar energia a partir de luz solar" },
    { label: "B", text: "Iniciar processo de decomposição completa do ser vivo" },
  ],
};

describe("QuestionScreen Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve mostrar o loading quando loading for true", () => {
    (useQuestionSession as jest.Mock).mockReturnValue({
      loading: true,
      question: null,
      progress: { current: 0, total: 0 },
    });

    render(<QuestionScreen />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("deve mostrar a mensagem de fim quando não houver mais questões", () => {
    (useQuestionSession as jest.Mock).mockReturnValue({
      loading: false,
      question: null,
      progress: { current: 20, total: 20 },
    });

    render(<QuestionScreen />);

    expect(
      screen.getByText("Todas as questões deste tipo foram respondidas neste tópico")
    ).toBeTruthy();
  });

  it("deve chamar confirmAnswer ao clicar em enviar", async () => {
    const mockConfirmAnswer = jest.fn().mockResolvedValue({ isCorrect: true });

    (useQuestionSession as jest.Mock).mockReturnValue({
      loading: false,
      question: mockQuestion,
      selected: "A",
      setSelected: jest.fn(),
      confirmAnswer: mockConfirmAnswer,
      nextQuestion: jest.fn(),
      feedback: null,
      progress: { current: 1, total: 20 },
    });

    render(<QuestionScreen />);

    const botaoEnviar = screen.getByText("Enviar");
    fireEvent.press(botaoEnviar);

    expect(mockConfirmAnswer).toHaveBeenCalled();
  });

  it("deve chamar nextQuestion ao clicar em avançar dentro da modal", () => {
    const mockNextQuestion = jest.fn();

    (useQuestionSession as jest.Mock).mockReturnValue({
      loading: false,
      question: mockQuestion,
      selected: "A",
      setSelected: jest.fn(),
      confirmAnswer: jest.fn(),
      nextQuestion: mockNextQuestion,
      feedback: { isCorrect: true },
      progress: { current: 1, total: 20 },
    });

    render(<QuestionScreen />);

    const modal = screen.UNSAFE_getByType("MockQuestionAnalysisBottomSheet" as any);
    modal.props.onNext();

    expect(mockNextQuestion).toHaveBeenCalledTimes(1);
  });
});
