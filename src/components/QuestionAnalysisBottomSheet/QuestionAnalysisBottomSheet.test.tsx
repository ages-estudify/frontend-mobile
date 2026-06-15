import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { QuestionAnalysisBottomSheet } from "./QuestionAnalysisBottomSheet";

jest.mock("@gorhom/bottom-sheet", () => {
  const React = jest.requireActual("react");
  const { View, ScrollView, TouchableOpacity } = jest.requireActual("react-native");

  const MockBottomSheet = React.forwardRef(
    (
      {
        children,
        ...props
      }: {
        children: React.ReactNode;
      },
      ref: React.Ref<unknown>
    ) => {
      return (
        <View ref={ref} {...props}>
          {children}
        </View>
      );
    }
  );

  MockBottomSheet.displayName = "MockBottomSheet";

  const MockBottomSheetScrollView = ({ children, ...props }: { children: React.ReactNode }) => {
    return <ScrollView {...props}>{children}</ScrollView>;
  };

  MockBottomSheetScrollView.displayName = "MockBottomSheetScrollView";

  return {
    __esModule: true,
    default: MockBottomSheet,
    BottomSheetScrollView: MockBottomSheetScrollView,
    TouchableOpacity,
  };
});

describe("QuestionAnalysisBottomSheet", () => {
  it("renderiza corretamente quando a resposta está correta", () => {
    const onNext = jest.fn();
    const onFinish = jest.fn();

    render(
      <QuestionAnalysisBottomSheet
        isCorrect={true}
        correctAlternative={{ letter: "A", text: "Alternativa correta" }}
        comment="Essa é a explicação da questão"
        onNext={onNext}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText("RESPOSTA CORRETA")).toBeTruthy();
    expect(screen.getByText("Análise")).toBeTruthy();
    expect(screen.getByText("Explicação")).toBeTruthy();
    expect(screen.getByText("Essa é a explicação da questão")).toBeTruthy();
    expect(screen.getByText("Próxima Questão")).toBeTruthy();
    expect(screen.getByText("Finalizar Treino")).toBeTruthy();
    expect(screen.getByText("Resosta correta:")).toBeTruthy();
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("Alternativa correta")).toBeTruthy();
  });

  it("renderiza corretamente quando a resposta está incorreta", () => {
    const onNext = jest.fn();
    const onFinish = jest.fn();

    render(
      <QuestionAnalysisBottomSheet
        isCorrect={false}
        correctAlternative={{ letter: "B", text: "Resposta certa" }}
        markedAlternative={{ letter: "C", text: "Resposta marcada" }}
        comment="Comentário da questão"
        onNext={onNext}
        onFinish={onFinish}
      />
    );

    expect(screen.getByText("RESPOSTA INCORRETA")).toBeTruthy();
    expect(screen.getByText("Resosta correta:")).toBeTruthy();
    expect(screen.getByText("Você marcou:")).toBeTruthy();
    expect(screen.getByText("Resposta certa")).toBeTruthy();
    expect(screen.getByText("Resposta marcada")).toBeTruthy();
  });

  it("chama onNext ao clicar em Próxima Questão", () => {
    const onNext = jest.fn();
    const onFinish = jest.fn();

    render(
      <QuestionAnalysisBottomSheet
        isCorrect={true}
        correctAlternative={{ letter: "A", text: "Alternativa correta" }}
        comment="Comentário"
        onNext={onNext}
        onFinish={onFinish}
      />
    );

    fireEvent.press(screen.getByText("Próxima Questão"));

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("chama onFinish ao clicar em Finalizar Treino", () => {
    const onNext = jest.fn();
    const onFinish = jest.fn();

    render(
      <QuestionAnalysisBottomSheet
        isCorrect={true}
        correctAlternative={{ letter: "A", text: "Alternativa correta" }}
        comment="Comentário"
        onNext={onNext}
        onFinish={onFinish}
      />
    );

    fireEvent.press(screen.getByText("Finalizar Treino"));

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });
});
