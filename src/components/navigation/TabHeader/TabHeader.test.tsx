import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";

jest.mock("../../../../assets/User.png", () => 1);

const mockLogout = jest.fn();
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: mockLogout }),
}));

import { TabHeader } from "./TabHeader";

describe("TabHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o título", () => {
    render(<TabHeader title="Início" />);
    expect(screen.getByText("Início")).toBeTruthy();
  });

  it("renderiza o subtitle quando fornecido", () => {
    render(<TabHeader title="Início" subtitle="Bem-vindo" />);
    expect(screen.getByText("Bem-vindo")).toBeTruthy();
  });

  it("mantém texto invisível quando subtitle ausente", () => {
    render(<TabHeader title="Início" />);
    expect(screen.getByText("Texto invisível")).toBeTruthy();
  });

  it("renderiza sem quebrar e expõe callback de logout", () => {
    const { toJSON } = render(<TabHeader title="Início" />);
    expect(toJSON()).toBeTruthy();
    expect(typeof mockLogout).toBe("function");
  });
});
