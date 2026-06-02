import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (callback: () => void | (() => void)) => {
      React.useEffect(() => {
        const cleanup = callback();
        return typeof cleanup === "function" ? cleanup : undefined;
      }, [callback]);
    },
  };
});

const mockUseAuthSession = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuthSession: () => mockUseAuthSession(),
}));

import { PlanGuard } from "./PlanGuard";

describe("PlanGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra loading enquanto sessão não hidratou", () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: false,
      role: "USER",
      planExpirationDate: null,
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
    });

    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );

    expect(screen.queryByText("Módulo")).toBeNull();
  });

  it("mostra paywall inline sem plano ativo (USER)", async () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "USER",
      planExpirationDate: null,
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
    });

    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );

    await waitFor(() => {
      expect(screen.getByText("Funcionalidade Exclusiva")).toBeTruthy();
    });
    expect(screen.queryByText("Módulo")).toBeNull();
  });

  it("mostra paywall quando data está no passado", async () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "USER",
      planExpirationDate: "2000-01-01T00:00:00.000Z",
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
    });

    render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );

    await waitFor(() => {
      expect(screen.getByText("Funcionalidade Exclusiva")).toBeTruthy();
    });
  });

  it("renderiza filhos com plano ativo (USER)", async () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "USER",
      planExpirationDate: "2099-12-31T23:59:59.000Z",
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
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

  it("renderiza filhos para ADM com planExpirationDate null", async () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "ADM",
      planExpirationDate: null,
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
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

  it("destrava conteúdo após atualizar planExpirationDate na sessão (rerender)", async () => {
    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "USER",
      planExpirationDate: null,
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
    });

    const { rerender } = render(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );

    await waitFor(() => {
      expect(screen.getByText("Funcionalidade Exclusiva")).toBeTruthy();
    });

    mockUseAuthSession.mockReturnValue({
      hydrated: true,
      role: "USER",
      planExpirationDate: "2099-12-31T23:59:59.000Z",
      setSessionFromCredentials: jest.fn(),
      updatePlanExpirationDate: jest.fn(),
      clearSessionMetadata: jest.fn(),
    });

    rerender(
      <PlanGuard>
        <Text>Módulo</Text>
      </PlanGuard>
    );

    await waitFor(() => {
      expect(screen.getByText("Módulo")).toBeTruthy();
    });
  });
});
