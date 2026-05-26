import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { TopicLabel } from "./TopicLabel";

describe("TopicLabel scaling", () => {
  it("keeps the default name font size without a scale", () => {
    render(<TopicLabel stageNumber={1} topicName="Álgebra" progressPercentage={0} />);

    const name = screen.getByTestId("topic-label-name");
    expect(StyleSheet.flatten(name.props.style).fontSize).toBe(15);
  });

  it("scales the topic name font size with the scale prop", () => {
    render(<TopicLabel stageNumber={1} topicName="Álgebra" progressPercentage={0} scale={2} />);

    const name = screen.getByTestId("topic-label-name");
    expect(StyleSheet.flatten(name.props.style).fontSize).toBe(30);
  });
});

describe("TopicLabel content", () => {
  it("clamps a percentage above 100 to 100%", () => {
    render(<TopicLabel stageNumber={1} topicName="Álgebra" progressPercentage={150} />);
    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("clamps a negative percentage to 0%", () => {
    render(<TopicLabel stageNumber={1} topicName="Álgebra" progressPercentage={-20} />);
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("treats a NaN percentage as 0%", () => {
    render(<TopicLabel stageNumber={1} topicName="Álgebra" progressPercentage={NaN} />);
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("pads single-digit stages and wraps multi-word names to two lines", () => {
    render(
      <TopicLabel stageNumber={3} topicName="Funções do segundo grau" progressPercentage={50} />
    );
    expect(screen.getByText("Etapa 03")).toBeTruthy();
    expect(screen.getByTestId("topic-label-name").props.numberOfLines).toBe(2);
  });

  it("renders a single-word name on a single line and clamps negative stages to zero", () => {
    render(<TopicLabel stageNumber={-5} topicName="Álgebra" progressPercentage={0} />);
    expect(screen.getByText("Etapa 00")).toBeTruthy();
    expect(screen.getByTestId("topic-label-name").props.numberOfLines).toBe(1);
  });
});
