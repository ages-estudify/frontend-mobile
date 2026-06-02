import { render, screen } from "@testing-library/react-native";
import React from "react";
import QuestionFeedbackButton from "./QuestionFeedbackButton";

describe("QuestionFeedbackButton", () => {
  it("renderiza o número quando feedback é Correct", () => {
    render(<QuestionFeedbackButton number={1} feedback="Correct" />);
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("renderiza o número quando feedback é Incorrect", () => {
    render(<QuestionFeedbackButton number={5} feedback="Incorrect" />);
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("renderiza o número quando feedback é Blank", () => {
    render(<QuestionFeedbackButton number={10} feedback="Blank" />);
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("não renderiza o número quando ghost é true", () => {
    render(<QuestionFeedbackButton number={3} feedback="Correct" ghost />);
    expect(screen.queryByText("3")).toBeNull();
  });

  it("renderiza sem quebrar", () => {
    const { toJSON } = render(<QuestionFeedbackButton number={7} feedback="Blank" />);
    expect(toJSON()).toBeTruthy();
  });
});
