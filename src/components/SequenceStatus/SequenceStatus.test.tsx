import { render, screen } from "@testing-library/react-native";
import React from "react";
import { SequenceStatus } from "./SequenceStatus";

jest.mock("../SequenceBox", () => {
  const React = jest.requireActual("react");
  const { Text, View } = jest.requireActual("react-native");
  return {
    SequenceBox: ({
      title,
      value,
      description,
    }: {
      title: string;
      value: number;
      description: string;
    }) => (
      <View>
        <Text>{title}</Text>
        <Text>{value}</Text>
        <Text>{description}</Text>
      </View>
    ),
  };
});

describe("SequenceStatus", () => {
  it("renders section title and both sequence boxes", () => {
    render(<SequenceStatus />);

    expect(screen.getByText("Sequência")).toBeTruthy();
    expect(screen.getByText("Sequência de Dias")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("Continue treinando!")).toBeTruthy();
    expect(screen.getByText("Estrelas")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("Responda questões e ganhe mais")).toBeTruthy();
  });
});
