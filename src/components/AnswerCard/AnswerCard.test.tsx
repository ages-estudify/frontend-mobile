import { render, screen } from "@testing-library/react-native";
import React from "react";
import { AnswerCard } from "./AnswerCard";

describe("AnswerCard", () => {
  it("renderiza a letra e o texto da alternativa", () => {
    render(<AnswerCard isCorrect alternative={{ letter: "A", text: "Resposta A" }} />);
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("Resposta A")).toBeTruthy();
  });

  it("exibe rótulo de resposta correta quando isCorrect é true", () => {
    render(<AnswerCard isCorrect alternative={{ letter: "B", text: "Resposta B" }} />);
    expect(screen.getByText(/Resosta correta:/)).toBeTruthy();
  });

  it("exibe rótulo de marcação quando isCorrect é false", () => {
    render(<AnswerCard isCorrect={false} alternative={{ letter: "C", text: "Resposta C" }} />);
    expect(screen.getByText(/Você marcou:/)).toBeTruthy();
  });
});
