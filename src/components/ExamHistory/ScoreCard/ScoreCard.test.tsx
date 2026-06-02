import { render, screen } from "@testing-library/react-native";
import React from "react";
import ScoreCard from "./ScoreCard";

describe("ScoreCard", () => {
  it("renderiza o título e o valor", () => {
    render(<ScoreCard title="Acertos" value={42} />);
    expect(screen.getByText("Acertos")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renderiza valor zero", () => {
    render(<ScoreCard title="Erros" value={0} />);
    expect(screen.getByText("Erros")).toBeTruthy();
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("renderiza sem crash quando value é undefined", () => {
    render(<ScoreCard title="Total" value={undefined} />);
    expect(screen.getByText("Total")).toBeTruthy();
  });
});
