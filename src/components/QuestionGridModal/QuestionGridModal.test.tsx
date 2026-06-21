import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { QuestionGridModal } from "./QuestionGridModal";
import { Question } from "@/types/questions.types";

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("../../../assets/icons/close-purple.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockXIcon() {
    return <View testID="icon-close" />;
  }
  return MockXIcon;
});

const makeQuestion = (overrides: Partial<Question> = {}): Question =>
  ({
    id: "q-1",
    number: 1,
    statement: "Enunciado",
    alternatives: [],
    selectedAlternativeId: null,
    ...overrides,
  }) as unknown as Question;

const makeQuestions = (count: number): Question[] =>
  Array.from({ length: count }, (_, i) => makeQuestion({ id: `q-${i + 1}`, number: i + 1 }));

describe("QuestionGridModal", () => {
  it("renderiza título e botão de finalizar quando visível", () => {
    render(
      <QuestionGridModal
        visible
        onClose={jest.fn()}
        questions={makeQuestions(3)}
        currentQuestionIndex={0}
        onGoToQuestion={jest.fn()}
        onFinishExam={jest.fn()}
      />
    );
    expect(screen.getByText("Grade de Questões")).toBeTruthy();
    expect(screen.getByText("Finalizar Simulado")).toBeTruthy();
  });

  it("renderiza os números das questões", () => {
    render(
      <QuestionGridModal
        visible
        onClose={jest.fn()}
        questions={makeQuestions(3)}
        currentQuestionIndex={0}
        onGoToQuestion={jest.fn()}
        onFinishExam={jest.fn()}
      />
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });

  it("chama onGoToQuestion e onClose ao pressionar uma questão", () => {
    const onGoToQuestion = jest.fn();
    const onClose = jest.fn();
    render(
      <QuestionGridModal
        visible
        onClose={onClose}
        questions={makeQuestions(3)}
        currentQuestionIndex={0}
        onGoToQuestion={onGoToQuestion}
        onFinishExam={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("2"));
    expect(onGoToQuestion).toHaveBeenCalledWith(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onFinishExam ao pressionar Finalizar Simulado", () => {
    const onFinishExam = jest.fn();
    render(
      <QuestionGridModal
        visible
        onClose={jest.fn()}
        questions={makeQuestions(3)}
        currentQuestionIndex={0}
        onGoToQuestion={jest.fn()}
        onFinishExam={onFinishExam}
      />
    );
    fireEvent.press(screen.getByText("Finalizar Simulado"));
    expect(onFinishExam).toHaveBeenCalledTimes(1);
  });
});
