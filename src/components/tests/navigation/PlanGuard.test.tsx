import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("expo-router", () => require("../../../../test/mocks/expo-router-redirect.js"));

const mockUseAuth = jest.fn();

jest.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

import { PlanGuard } from "../../navigation/PlanGuard";

describe("PlanGuard", () => {
  it("redireciona para planos sem plano ativo", () => {
    mockUseAuth.mockReturnValue({
      session: { token: "t", role: "USER", planActive: false },
    });
    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );
    expect(screen.getByTestId("redirect-href")).toHaveTextContent("/planos");
    expect(screen.queryByText("Módulo")).toBeNull();
  });

  it("renderiza filhos com plano ativo", () => {
    mockUseAuth.mockReturnValue({
      session: { token: "t", role: "USER", planActive: true },
    });
    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );
    expect(screen.getByText("Módulo")).toBeTruthy();
  });
});
