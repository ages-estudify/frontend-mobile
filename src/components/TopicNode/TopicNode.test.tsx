import { render, screen } from "@testing-library/react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { TopicNode } from "./TopicNode";

describe("TopicNode scaling", () => {
  it("renders the default circle size without a scale", () => {
    render(
      <TopicNode
        iconKey="book"
        progressPercentage={0}
        onPress={jest.fn()}
        accessibilityLabel="Álgebra"
      />
    );

    const circle = screen.getByTestId("topic-node-circle");
    expect(StyleSheet.flatten(circle.props.style).width).toBe(60);
  });

  it("scales the circle size up on tablets", () => {
    render(
      <TopicNode
        iconKey="book"
        progressPercentage={0}
        onPress={jest.fn()}
        accessibilityLabel="Álgebra"
        scale={1.5}
      />
    );

    const circle = screen.getByTestId("topic-node-circle");
    const flat = StyleSheet.flatten(circle.props.style);
    expect(flat.width).toBe(90);
    expect(flat.height).toBe(90);
  });
});
