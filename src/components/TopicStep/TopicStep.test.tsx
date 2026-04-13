import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { TopicStep } from "./TopicStep";

describe("TopicStep", () => {
  it("shows padded step number and no progress suffix when not started", () => {
    render(
      <TopicStep
        title="Álgebra"
        description="Introdução"
        icon="https://example.com/i.png"
        stepNumber={3}
        donePercentage={0}
      />
    );

    expect(screen.getByText("Etapa 03 ")).toBeTruthy();
    expect(screen.getByText("Álgebra")).toBeTruthy();
    expect(screen.getByText("Introdução")).toBeTruthy();
  });

  it("shows in-progress label when partially complete", () => {
    render(
      <TopicStep title="Geometria" description="Ângulos" stepNumber={10} donePercentage={40} />
    );

    expect(screen.getByText("Etapa 10 - EM ANDAMENTO · 40%")).toBeTruthy();
  });

  it("uses single-digit formatting only below 10", () => {
    render(<TopicStep title="T" description="D" stepNumber={12} donePercentage={0} />);

    expect(screen.getByText("Etapa 12 ")).toBeTruthy();
  });

  it("calls onPress when the row is pressed", () => {
    const onPress = jest.fn();

    render(
      <TopicStep title="T" description="D" stepNumber={1} donePercentage={0} onPress={onPress} />
    );

    fireEvent.press(screen.getByText("T"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
