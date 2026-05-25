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
