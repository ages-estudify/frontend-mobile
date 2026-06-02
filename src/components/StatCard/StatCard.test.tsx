import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renderiza o label e o value", () => {
    render(<StatCard icon={<Text>icon</Text>} label="Acertos" value="42" />);
    expect(screen.getByText("Acertos")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renderiza o ícone fornecido", () => {
    render(<StatCard icon={<Text>my-icon</Text>} label="Acertos" value="42" />);
    expect(screen.getByText("my-icon")).toBeTruthy();
    expect(screen.getByTestId("stat-card-icon")).toBeTruthy();
  });
});
