import { render, screen } from "@testing-library/react-native";
import React from "react";
import GraphCard from "./graphCard";

jest.mock("react-native-gifted-charts", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  return {
    PieChart: function MockPieChart() {
      return <View testID="pie-chart" />;
    },
  };
});

describe("GraphCard", () => {
  it("renderiza os rótulos das categorias", () => {
    render(<GraphCard correct={5} incorrect={3} blank={2} totalQuestions={10} />);
    expect(screen.getByText("Corretas")).toBeTruthy();
    expect(screen.getByText("Incorretas")).toBeTruthy();
  });

  it("calcula e exibe os percentuais corretamente", () => {
    render(<GraphCard correct={5} incorrect={3} blank={2} totalQuestions={10} />);
    expect(screen.getByText("50%")).toBeTruthy();
    expect(screen.getByText("30%")).toBeTruthy();
    expect(screen.getByText("20%")).toBeTruthy();
  });

  it("renderiza o gráfico de pizza", () => {
    render(<GraphCard correct={1} incorrect={1} blank={1} totalQuestions={3} />);
    expect(screen.getByTestId("pie-chart")).toBeTruthy();
  });
});
