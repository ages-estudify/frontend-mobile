import React from "react";
import { render } from "@testing-library/react-native";
import { GamificationMetrics } from "./GamificationMetrics";

describe("GamificationMetrics", () => {
  it("renders with given metrics", () => {
    const { getByText } = render(<GamificationMetrics stars={10} streak={5} />);
    expect(getByText("Estrelas: 10")).toBeTruthy();
    expect(getByText("Sequência de Dias: 5")).toBeTruthy();
  });

  it("renders default 0 values", () => {
    const { getByText } = render(<GamificationMetrics />);
    expect(getByText("Estrelas: 0")).toBeTruthy();
    expect(getByText("Sequência de Dias: 0")).toBeTruthy();
  });
});
