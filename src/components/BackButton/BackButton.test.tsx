import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { BackButton } from "./BackButton";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock("../../../assets/icons/back_arrow.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  return function MockBackArrow() {
    return <View testID="back-arrow" />;
  };
});

describe("BackButton", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("calls router.back when pressed", () => {
    render(<BackButton />);

    const arrow = screen.getByTestId("back-arrow");
    expect(arrow).toBeTruthy();

    const pressable = arrow.parent;
    expect(pressable).toBeTruthy();
    fireEvent.press(pressable!);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("calls onPress when provided", () => {
    const mockOnPress = jest.fn();
    render(<BackButton onPress={mockOnPress} />);

    const arrow = screen.getByTestId("back-arrow");
    const pressable = arrow.parent;
    fireEvent.press(pressable!);

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
