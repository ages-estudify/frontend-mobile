import { render, screen } from "@testing-library/react-native";
import React from "react";
import { SequenceBox } from "./SequenceBox";

jest.mock("../../../assets/icons/fire.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockFireIcon() {
    return <View testID="icon-fire" />;
  }
  return MockFireIcon;
});

jest.mock("../../../assets/icons/star.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockStarIcon() {
    return <View testID="icon-star" />;
  }
  return MockStarIcon;
});

describe("SequenceBox", () => {
  it("shows title, value, description and fire icon for sequence variant", () => {
    render(
      <SequenceBox title="Sequência de Dias" value={7} description="Continue!" variant="sequence" />
    );

    expect(screen.getByText("Sequência de Dias: 7")).toBeTruthy();
    expect(screen.getByText("Continue!")).toBeTruthy();
    expect(screen.getByTestId("icon-fire")).toBeTruthy();
    expect(screen.queryByTestId("icon-star")).toBeNull();
  });

  it("shows star icon for stars variant", () => {
    render(<SequenceBox title="Estrelas" value={3} description="Ganhe mais" variant="stars" />);

    expect(screen.getByText("Estrelas: 3")).toBeTruthy();
    expect(screen.getByTestId("icon-star")).toBeTruthy();
    expect(screen.queryByTestId("icon-fire")).toBeNull();
  });
});
