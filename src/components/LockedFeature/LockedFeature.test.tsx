import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { LockedFeature } from "./LockedFeature";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));

jest.mock("../../../assets/icons/lock.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  return function MockLockIcon() {
    return <View testID="lock-icon" />;
  };
});

describe("LockedFeature", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renderiza o título e o botão", () => {
    render(<LockedFeature />);
    expect(screen.getByText("Funcionalidade Exclusiva")).toBeTruthy();
    expect(screen.getByText("Ver Planos")).toBeTruthy();
  });

  it("navega para /plans ao pressionar Ver Planos", () => {
    render(<LockedFeature />);
    fireEvent.press(screen.getByTestId("planos"));
    expect(mockPush).toHaveBeenCalledWith("/plans");
  });
});
