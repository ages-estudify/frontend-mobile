import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { QuestionTypeBox } from "./QuestionTypeBox";

jest.mock("../../../assets/icons/original.questions.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockOriginalIcon() {
    return <View testID="icon-original" />;
  }
  return MockOriginalIcon;
});

jest.mock("../../../assets/icons/simplified_questions.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockSimplifiedIcon() {
    return <View testID="icon-simplified" />;
  }
  return MockSimplifiedIcon;
});

describe("QuestionTypeBox", () => {
  it("renders title and description for the original variant", () => {
    render(
      <QuestionTypeBox
        variant="original"
        title="Originais"
        description="Formato da banca"
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText("Originais")).toBeTruthy();
    expect(screen.getByText("Formato da banca")).toBeTruthy();
    expect(screen.getByTestId("icon-original")).toBeTruthy();
    expect(screen.queryByTestId("icon-simplified")).toBeNull();
  });

  it("renders the simplified icon when variant is simplified", () => {
    render(
      <QuestionTypeBox variant="simplified" title="Simplificadas" description="Mais curtas" />
    );

    expect(screen.getByTestId("icon-simplified")).toBeTruthy();
    expect(screen.queryByTestId("icon-original")).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();

    render(<QuestionTypeBox title="T" description="D" onPress={onPress} />);

    fireEvent.press(screen.getByText("T"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
