import { render, screen } from "@testing-library/react-native";
import React from "react";
import { CircularProgress } from "./CircularProgress";

describe("CircularProgress", () => {
  it("exibe a porcentagem informada", () => {
    render(<CircularProgress percentage={42} />);
    expect(screen.getByText("42%")).toBeTruthy();
  });

  it("exibe 0% por padrão", () => {
    render(<CircularProgress />);
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("limita a porcentagem em 100", () => {
    render(<CircularProgress percentage={150} />);
    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("limita a porcentagem em 0 quando negativa", () => {
    render(<CircularProgress percentage={-20} />);
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("exibe o label quando informado", () => {
    render(<CircularProgress percentage={50} label="Progresso" />);
    expect(screen.getByText("Progresso")).toBeTruthy();
  });

  it("não exibe label quando ausente", () => {
    render(<CircularProgress percentage={50} />);
    expect(screen.queryByText("Progresso")).toBeNull();
  });
});
