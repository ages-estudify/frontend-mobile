import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import SegmentedControl from "./SegmentedControl";

describe("SegmentedControl", () => {
  it("renderiza todas as opções", () => {
    render(<SegmentedControl selected="ALL" onChange={jest.fn()} />);
    expect(screen.getByText("Todas")).toBeTruthy();
    expect(screen.getByText("Corretas")).toBeTruthy();
    expect(screen.getByText("Incorretas")).toBeTruthy();
    expect(screen.getByText("Vazias")).toBeTruthy();
  });

  it("chama onChange com o valor da opção pressionada", () => {
    const onChange = jest.fn();
    render(<SegmentedControl selected="ALL" onChange={onChange} />);
    fireEvent.press(screen.getByText("Corretas"));
    expect(onChange).toHaveBeenCalledWith("CORRECT");
  });
});
