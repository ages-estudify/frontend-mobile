import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressSummaryCards } from "./ProgressSummaryCards";

describe("ProgressSummaryCards", () => {
  it("renders accurately with data", () => {
    const level = { current: 5, max: 10 };
    const completedTopics = { completed: 2, total: 20 };
    const { getByText } = render(
      <ProgressSummaryCards
        level={level}
        completedTopics={completedTopics}
        accuracyPercentage={40}
      />
    );
    expect(getByText("5")).toBeTruthy();
    expect(getByText("/10")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
    expect(getByText("/20")).toBeTruthy();
    expect(getByText("40")).toBeTruthy();
  });

  it("handles undefined gracefully", () => {
    const { getAllByText } = render(<ProgressSummaryCards />);
    expect(getAllByText("0").length).toBeGreaterThan(0);
  });
});
