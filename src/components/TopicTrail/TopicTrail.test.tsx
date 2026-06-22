import { render, screen } from "@testing-library/react-native";
import React from "react";
import * as ReactNative from "react-native";
import { MAX_TRAIL_WIDTH, resolveTrailLayout, TopicTrail, type TopicTrailItem } from "./TopicTrail";

const items: TopicTrailItem[] = [
  { id: "a", stageNumber: 1, name: "Álgebra", progressPercentage: 0 },
  { id: "b", stageNumber: 2, name: "Geometria", progressPercentage: 50 },
  { id: "c", stageNumber: 3, name: "Trigonometria", progressPercentage: 100 },
];

function mockWindowWidth(width: number) {
  jest
    .spyOn(ReactNative.Dimensions, "get")
    .mockReturnValue({ width, height: 800, scale: 1, fontScale: 1 });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("TopicTrail responsiveness", () => {
  it("sizes the container to a narrow device width instead of the fixed 380", () => {
    mockWindowWidth(320);
    render(<TopicTrail topics={items} onTopicPress={jest.fn()} />);

    const container = screen.getByTestId("topic-trail-container");
    const flat = ReactNative.StyleSheet.flatten(container.props.style);
    expect(flat.width).toBe(resolveTrailLayout(320).containerWidth);
    expect(flat.width).toBe(320);
  });

  it("grows and caps the scaled container width on large screens", () => {
    mockWindowWidth(900);
    render(<TopicTrail topics={items} onTopicPress={jest.fn()} />);

    const container = screen.getByTestId("topic-trail-container");
    const flat = ReactNative.StyleSheet.flatten(container.props.style);
    expect(flat.width).toBe(resolveTrailLayout(900).containerWidth);
    expect(flat.width).toBeGreaterThan(MAX_TRAIL_WIDTH);
  });

  it("keeps the SVG width in sync with the container width", () => {
    mockWindowWidth(360);
    render(<TopicTrail topics={items} onTopicPress={jest.fn()} />);

    const svg = screen.getByTestId("topic-trail-svg");
    expect(svg.props.width).toBe(360);
  });
});
