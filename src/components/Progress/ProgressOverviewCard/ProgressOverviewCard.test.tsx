import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressOverviewCard } from "./ProgressOverviewCard";

describe("ProgressOverviewCard", () => {
  it("renders correctly with full data", () => {
    const overview = { totalAnswered: 100, totalCorrect: 50, accuracyPercentage: 50 };
    const { getByText } = render(<ProgressOverviewCard overview={overview} />);
    expect(getByText("Progresso Geral")).toBeTruthy();
    expect(getByText("100")).toBeTruthy();
    expect(getByText("50")).toBeTruthy();
  });

  it("renders safely with zero or undefined data", () => {
    const { getByText, getAllByText } = render(<ProgressOverviewCard />);
    expect(getByText("Progresso Geral")).toBeTruthy();
    expect(getAllByText("0")).toHaveLength(2);
  });
});
