import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import IntroSlider from "./IntroSlider";

jest.mock("../../../assets/intro-1.png", () => 1);
jest.mock("../../../assets/intro-2.png", () => 2);
jest.mock("../../../assets/intro-3.png", () => 3);

describe("IntroSlider", () => {
  it("renderiza o primeiro slide", () => {
    render(<IntroSlider onFinish={jest.fn()} />);
    expect(screen.getByText("Treine\nSempre")).toBeTruthy();
  });

  it("exibe os botões Pular e Próximo no início", () => {
    render(<IntroSlider onFinish={jest.fn()} />);
    expect(screen.getByText("→ Pular")).toBeTruthy();
    expect(screen.getByText("Próximo")).toBeTruthy();
  });

  it("chama onFinish ao pressionar Pular no primeiro slide", () => {
    const onFinish = jest.fn();
    render(<IntroSlider onFinish={onFinish} />);
    fireEvent.press(screen.getByText("→ Pular"));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
