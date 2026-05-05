import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

import { SubscriptionPaywallInline } from "./SubscriptionPaywallInline";

describe("SubscriptionPaywallInline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("CTA Ver Planos chama router.push para /plans", () => {
    render(<SubscriptionPaywallInline />);

    fireEvent.press(screen.getByTestId("planos"));

    expect(mockPush).toHaveBeenCalledWith("/plans");
  });

  it("renderiza título do paywall", () => {
    render(<SubscriptionPaywallInline />);
    expect(screen.getByText("Funcionalidade Exclusiva")).toBeTruthy();
  });
});
