import { render, screen } from "@testing-library/react-native";
import React from "react";
import TimerExam from "./TimerExam";

describe("TimerExam", () => {
  it("exibe o tempo informado", () => {
    render(<TimerExam time="12:34" />);
    expect(screen.getByText("12:34")).toBeTruthy();
  });

  it("exibe 00:00 quando time é undefined", () => {
    render(<TimerExam time={undefined} />);
    expect(screen.getByText("00:00")).toBeTruthy();
  });

  it("exibe 00:00 quando time é string vazia", () => {
    render(<TimerExam time="" />);
    expect(screen.getByText("00:00")).toBeTruthy();
  });
});
