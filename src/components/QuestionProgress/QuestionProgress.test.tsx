import { render, screen } from "@testing-library/react-native";
import React from "react";
import QuestionProgress from "./QuestionProgress";

describe("QuestionProgress", () => {
  it("renderiza o progresso atual e total", () => {
    render(<QuestionProgress progress={{ current: 3, total: 10 }} />);
    expect(screen.getByText("3 / 10")).toBeTruthy();
  });

  it("renderiza sem quebrar com progresso completo", () => {
    const { toJSON } = render(<QuestionProgress progress={{ current: 10, total: 10 }} />);
    expect(toJSON()).toBeTruthy();
  });
});
