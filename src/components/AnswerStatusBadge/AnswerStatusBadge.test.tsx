import { render, screen } from "@testing-library/react-native";
import React from "react";
import { AnswerStatusBadge } from "./AnswerStatusBadge";

describe("AnswerStatusBadge", () => {
  it("exibe RESPOSTA CORRETA quando isCorrect é true", () => {
    render(<AnswerStatusBadge isCorrect />);
    expect(screen.getByText(/RESPOSTA CORRETA/)).toBeTruthy();
  });

  it("exibe RESPOSTA INCORRETA quando isCorrect é false", () => {
    render(<AnswerStatusBadge isCorrect={false} />);
    expect(screen.getByText(/RESPOSTA INCORRETA/)).toBeTruthy();
  });
});
