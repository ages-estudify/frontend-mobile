import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ExamCard } from "./ExamCard";
import { Exam } from "../../types/exam.types";

jest.mock("../../../assets/enem 2.png", () => 1);
jest.mock("../../../assets/ufrgs_cor 1 1.png", () => 2);

const baseExam: Exam = {
  id: "exam-1",
  name: "Simulado ENEM 2024",
  origin: "ORIGINAL",
  description: "Novembro: Dia 1",
  imageUrl: null,
  status: "available",
  totalQuestions: 180,
  answeredQuestions: 0,
  progress: { answered: 0, total: 180, percentage: 0 },
  hasLanguageChoice: true,
  days: [],
};

const makeExam = (overrides: Partial<Exam>): Exam => ({ ...baseExam, ...overrides });

describe("ExamCard", () => {
  it("renderiza o nome do simulado", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("Simulado ENEM 2024")).toBeTruthy();
  });

  it("mapeia origin ORIGINAL para label ENEM", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("ENEM")).toBeTruthy();
  });

  it("mapeia origin EXTERNAL para label UFRGS", () => {
    const exam = makeExam({ origin: "EXTERNAL" });
    render(<ExamCard exam={exam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("UFRGS")).toBeTruthy();
  });

  it("exibe totalQuestions corretamente", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("180 questões")).toBeTruthy();
  });

  it("exibe a description quando presente", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("Novembro: Dia 1")).toBeTruthy();
  });

  it("não exibe description quando ausente", () => {
    const exam = makeExam({ description: undefined });
    render(<ExamCard exam={exam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.queryByText("Novembro: Dia 1")).toBeNull();
  });

  it("exibe badge Finalizado quando percentage >= 100", () => {
    const exam = makeExam({
      status: "completed",
      progress: { answered: 180, total: 180, percentage: 100 },
    });
    render(<ExamCard exam={exam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("Finalizado")).toBeTruthy();
  });

  it("não exibe badge Finalizado quando percentage < 100", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.queryByText("Finalizado")).toBeNull();
  });

  it("chama onPress ao pressionar o card", () => {
    const onPress = jest.fn();
    render(<ExamCard exam={baseExam} onPress={onPress} onMenuPress={jest.fn()} />);
    fireEvent.press(screen.getByText("Simulado ENEM 2024"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renderiza o botão de menu ⋯", () => {
    render(<ExamCard exam={baseExam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(screen.getByText("⋯")).toBeTruthy();
  });

  it("renderiza a ProgressBar sem erros com percentage do progress", () => {
    const exam = makeExam({
      status: "in_progress",
      progress: { answered: 90, total: 180, percentage: 50 },
    });
    const { toJSON } = render(<ExamCard exam={exam} onPress={jest.fn()} onMenuPress={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });
});
