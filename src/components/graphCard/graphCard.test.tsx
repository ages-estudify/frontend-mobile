import { render, screen } from "@testing-library/react-native";
import React from "react";
import GraphCard from "./graphCard";

const mockPieChart = jest.fn();

jest.mock("react-native-gifted-charts", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  return {
    PieChart: function MockPieChart(props: unknown) {
      mockPieChart(props);
      return <View testID="pie-chart" />;
    },
  };
});

describe("GraphCard", () => {
  beforeEach(() => {
    mockPieChart.mockClear();
  });

  it("renderiza os rotulos das categorias", () => {
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

  it("renderiza o grafico de pizza", () => {
    render(<GraphCard correct={1} incorrect={1} blank={1} totalQuestions={3} />);
    expect(screen.getByTestId("pie-chart")).toBeTruthy();
  });

  it("renderiza apenas fatias verde e vermelha quando showBlank for false", () => {
    render(<GraphCard correct={3} incorrect={1} blank={0} totalQuestions={4} showBlank={false} />);

    const pieProps = mockPieChart.mock.calls[0][0];

    expect(pieProps.data).toEqual([
      { value: 3, color: "#7ED957" },
      { value: 1, color: "#D93B3B" },
    ]);
    expect(screen.queryByText("Não\nRespondidas")).toBeNull();
  });

  it("calcula os percentuais do modo treino sem fatia em branco", () => {
    render(<GraphCard correct={3} incorrect={1} blank={0} totalQuestions={4} showBlank={false} />);

    expect(screen.getByText("75%")).toBeTruthy();
    expect(screen.getByText("25%")).toBeTruthy();
    expect(screen.queryByText("0%")).toBeNull();
  });

  it("trata divisao por zero defensivamente", () => {
    render(<GraphCard correct={0} incorrect={0} blank={0} totalQuestions={0} showBlank={false} />);

    expect(screen.getAllByText("0%")).toHaveLength(2);
  });
});
