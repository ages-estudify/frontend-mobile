import React from "react";
import { render } from "@testing-library/react-native";
import { SimuladosProgressSection } from "./SimuladosProgressSection";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("SimuladosProgressSection", () => {
  it("renders empty state when array is empty", () => {
    const { getByText } = render(<SimuladosProgressSection simulados={[]} />);
    expect(getByText("Você ainda não tem simulados")).toBeTruthy();
    expect(getByText("Começar Simulado")).toBeTruthy();
  });

  it("renders simulados list when data is available", () => {
    const mockSimulados = [
      {
        attemptId: "1",
        examName: "ENEM",
        date: "2026-01-01",
        days: [{ day: 1, label: "Dia 1", correct: 10, total: 20, scorePercentage: 50 }],
      },
    ];
    const { getByText } = render(<SimuladosProgressSection simulados={mockSimulados} />);
    expect(getByText("ENEM")).toBeTruthy();
    expect(getByText("Dia 1")).toBeTruthy();
    expect(getByText("50%")).toBeTruthy();
  });
});
