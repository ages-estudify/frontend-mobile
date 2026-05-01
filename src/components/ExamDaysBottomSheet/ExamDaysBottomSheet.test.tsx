import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ExamDaysBottomSheet } from "./ExamDaysBottomSheet";
import { Exam } from "../../types/exam.types";

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children }: any) => <View>{children}</View>,
    BottomSheetView: ({ children }: any) => <View>{children}</View>,
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("@/constants/tabBarLayout", () => ({
  tabBarBottomOffset: () => 0,
  TAB_BAR_HEIGHT: 64,
}));

const makeExam = (overrides: Partial<Exam> = {}): Exam => ({
  id: "exam-1",
  name: "Simulado ENEM 2024",
  origin: "ORIGINAL",
  description: "Descrição do simulado",
  imageUrl: null,
  status: "available",
  totalQuestions: 180,
  answeredQuestions: 0,
  progress: { answered: 0, total: 180, percentage: 0 },
  hasLanguageChoice: false,
  days: [
    {
      examDayId: "day-1",
      day: 1,
      totalQuestions: 90,
      answeredQuestions: 0,
      status: "available",
      isCompleted: false,
      hasLanguageChoice: false,
    },
    {
      examDayId: "day-2",
      day: 2,
      totalQuestions: 90,
      answeredQuestions: 0,
      status: "available",
      isCompleted: false,
      hasLanguageChoice: false,
    },
  ],
  ...overrides,
});

describe("ExamDaysBottomSheet", () => {
  it("renderiza o título e a descrição", () => {
    render(
      <ExamDaysBottomSheet
        exam={makeExam()}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("Escolha o dia da prova")).toBeTruthy();
    expect(screen.getByText("Descrição do simulado")).toBeTruthy();
  });

  it("renderiza os dias corretamente", () => {
    render(
      <ExamDaysBottomSheet
        exam={makeExam()}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("Dia 1")).toBeTruthy();
    expect(screen.getByText("Dia 2")).toBeTruthy();
    expect(screen.getAllByText("90 Questões")).toHaveLength(2);
  });

  it("exibe badge Finalizado para dias completados", () => {
    const exam = makeExam({
      days: [
        {
          examDayId: "day-1",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 90,
          status: "completed",
          isCompleted: true,
          attemptDayId: "attempt-1",
        },
      ],
    });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("Finalizado")).toBeTruthy();
  });

  it("exibe badge Em andamento para dias in_progress", () => {
    const exam = makeExam({
      days: [
        {
          examDayId: "day-1",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 30,
          status: "in_progress",
          isCompleted: false,
          attemptDayId: "attempt-1",
        },
      ],
    });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText("Em andamento")).toBeTruthy();
  });

  it("chama onStartDay ao clicar em dia available sem hasLanguageChoice", () => {
    const onStartDay = jest.fn();
    render(
      <ExamDaysBottomSheet
        exam={makeExam()}
        onContinueDay={jest.fn()}
        onStartDay={onStartDay}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Dia 1"));
    expect(onStartDay).toHaveBeenCalledWith("day-1");
  });

  it("chama onContinueDay ao clicar em dia in_progress", () => {
    const onContinueDay = jest.fn();
    const exam = makeExam({
      days: [
        {
          examDayId: "day-1",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 30,
          status: "in_progress",
          isCompleted: false,
          attemptDayId: "attempt-1",
        },
      ],
    });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={onContinueDay}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Dia 1"));
    expect(onContinueDay).toHaveBeenCalledWith("day-1");
  });

  it("chama onOpenLanguage ao clicar em dia available com hasLanguageChoice", () => {
    const onOpenLanguage = jest.fn();
    const exam = makeExam({
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
    });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={onOpenLanguage}
        onClose={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Dia 1"));
    expect(onOpenLanguage).toHaveBeenCalledWith("day-1");
  });

  it("navega para resultado ao clicar em dia completed com attemptDayId", () => {
    const { router } = require("expo-router");
    const exam = makeExam({
      days: [
        {
          examDayId: "day-1",
          day: 1,
          totalQuestions: 90,
          answeredQuestions: 90,
          status: "completed",
          isCompleted: true,
          attemptDayId: "attempt-1",
        },
      ],
    });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    fireEvent.press(screen.getByText("Dia 1"));
    expect(router.push).toHaveBeenCalled();
  });

  it("usa fallback de descrição quando description é undefined", () => {
    const exam = makeExam({ description: undefined });
    render(
      <ExamDaysBottomSheet
        exam={exam}
        onContinueDay={jest.fn()}
        onStartDay={jest.fn()}
        onOpenLanguage={jest.fn()}
        onClose={jest.fn()}
      />
    );
    expect(
      screen.getByText("Simulado inéditas com questões elaboradas pela equipe Estudify")
    ).toBeTruthy();
  });
});
