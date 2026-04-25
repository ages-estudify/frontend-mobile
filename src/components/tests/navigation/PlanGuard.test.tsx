import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("expo-router", () => require("../../../../test/mocks/expo-router-redirect.js"));

const mockUseAuth = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

import { PlanGuard } from "../../navigation/PlanGuard";

describe("PlanGuard", () => {
  it("redireciona para paywall sem plano ativo", async () => {
    mockUseAuth.mockReturnValue({
      isPlanActive: jest.fn().mockResolvedValue(false),
    });
    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );
    await waitFor(() => {
      expect(screen.getByTestId("redirect-href")).toHaveTextContent("/paywall");
    });
    expect(screen.queryByText("Módulo")).toBeNull();
  });

  it("renderiza filhos com plano ativo", async () => {
    mockUseAuth.mockReturnValue({
      isPlanActive: jest.fn().mockResolvedValue(true),
    });
    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );
    await waitFor(() => {
      expect(screen.getByText("Módulo")).toBeTruthy();
    });
  });
});
