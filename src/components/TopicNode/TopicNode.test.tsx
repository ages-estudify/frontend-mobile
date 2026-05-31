import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { getTopicNodeStyle, TopicNode } from "./TopicNode";

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

describe("TopicNode icon rendering", () => {
  it("renders the remote icon and falls back to the default icon on load error", () => {
    render(
      <TopicNode
        iconKey="book"
        iconUrl="https://x/icon.png"
        progressPercentage={40}
        onPress={jest.fn()}
        accessibilityLabel="Álgebra"
      />
    );

    const image = screen.UNSAFE_getByType(Image);
    expect(image.props.source).toEqual({ uri: "https://x/icon.png" });

    fireEvent(image, "error");

    expect(screen.UNSAFE_queryByType(Image)).toBeNull();
  });

  it("falls back to the default icon for an unknown icon key", () => {
    render(
      <TopicNode
        iconKey="nonexistent-icon"
        progressPercentage={0}
        onPress={jest.fn()}
        accessibilityLabel="Álgebra"
      />
    );

    expect(screen.UNSAFE_queryByType(Image)).toBeNull();
    expect(screen.getByTestId("topic-node-circle")).toBeTruthy();
  });
});

describe("TopicNode style helpers", () => {
  it("uses the default node size in getTopicNodeStyle when size is omitted", () => {
    const style = getTopicNodeStyle("#FFFFFF");
    expect(style.width).toBe(60);
    expect(style.height).toBe(60);
    expect(style.borderRadius).toBe(30);
  });

  it("stays mounted through the press lifecycle", () => {
    const onPress = jest.fn();
    render(
      <TopicNode
        iconKey="book"
        progressPercentage={0}
        onPress={onPress}
        accessibilityLabel="Álgebra"
      />
    );

    const pressable = screen.getByLabelText("Álgebra");
    fireEvent(pressable, "pressIn");
    fireEvent(pressable, "pressOut");
    fireEvent.press(pressable);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("topic-node-circle")).toBeTruthy();
  });
});
