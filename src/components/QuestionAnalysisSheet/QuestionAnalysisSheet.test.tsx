import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { QuestionAnalysisSheet } from "./QuestionAnalysisSheet";

const baseProps = {
  correctAlternative: { letter: "A", text: "Alternativa correta" },
  markedAlternative: { letter: "B", text: "Alternativa marcada" },
  comment: "Explicação detalhada da questão",
  onNext: jest.fn(),
  onFinish: jest.fn(),
};

describe("QuestionAnalysisSheet", () => {
  it("renderiza análise, explicação e botões", () => {
    render(<QuestionAnalysisSheet {...baseProps} isCorrect />);
    expect(screen.getByText("Análise")).toBeTruthy();
    expect(screen.getByText("Explicação")).toBeTruthy();
    expect(screen.getByText("Explicação detalhada da questão")).toBeTruthy();
    expect(screen.getByText("Próxima Questão")).toBeTruthy();
    expect(screen.getByText("Finalizar Treino")).toBeTruthy();
  });

  it("exibe somente a alternativa correta quando isCorrect é true", () => {
    render(<QuestionAnalysisSheet {...baseProps} isCorrect />);
    expect(screen.getByText("Alternativa correta")).toBeTruthy();
    expect(screen.queryByText("Alternativa marcada")).toBeNull();
  });

  it("exibe a alternativa marcada quando isCorrect é false", () => {
    render(<QuestionAnalysisSheet {...baseProps} isCorrect={false} />);
    expect(screen.getByText("Alternativa correta")).toBeTruthy();
    expect(screen.getByText("Alternativa marcada")).toBeTruthy();
  });

  it("chama onNext ao pressionar Próxima Questão", () => {
    const onNext = jest.fn();
    render(<QuestionAnalysisSheet {...baseProps} isCorrect onNext={onNext} />);
    fireEvent.press(screen.getByText("Próxima Questão"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("chama onFinish ao pressionar Finalizar Treino", () => {
    const onFinish = jest.fn();
    render(<QuestionAnalysisSheet {...baseProps} isCorrect onFinish={onFinish} />);
    fireEvent.press(screen.getByText("Finalizar Treino"));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
