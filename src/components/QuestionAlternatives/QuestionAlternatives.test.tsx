import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import QuestionAlternatives from "./QuestionAlternatives";
import { Alternative } from "@/types/questions.types";

const alternatives: Alternative[] = [
  { id: "1", label: "A", text: "Primeira opção" },
  { id: "2", label: "B", text: "Segunda opção" },
  { id: "3", label: "C", text: "Terceira opção" },
];

describe("QuestionAlternatives", () => {
  it("renderiza todas as alternativas com letra e texto", () => {
    render(
      <QuestionAlternatives alternatives={alternatives} selected={null} setSelected={jest.fn()} />
    );
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("Primeira opção")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
    expect(screen.getByText("Segunda opção")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
  });

  it("chama setSelected com o label ao pressionar uma alternativa", () => {
    const setSelected = jest.fn();
    render(
      <QuestionAlternatives alternatives={alternatives} selected={null} setSelected={setSelected} />
    );
    fireEvent.press(screen.getByText("Segunda opção"));
    expect(setSelected).toHaveBeenCalledWith("B");
  });

  it("renderiza com uma alternativa selecionada sem quebrar", () => {
    const { toJSON } = render(
      <QuestionAlternatives alternatives={alternatives} selected="A" setSelected={jest.fn()} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it("usa letter quando label está ausente", () => {
    const setSelected = jest.fn();
    const alts: Alternative[] = [{ id: "x", letter: "D", text: "Opção D" }];
    render(<QuestionAlternatives alternatives={alts} selected={null} setSelected={setSelected} />);
    fireEvent.press(screen.getByText("Opção D"));
    expect(setSelected).toHaveBeenCalledWith("D");
  });
});
