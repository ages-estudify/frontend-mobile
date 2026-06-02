import { render } from "@testing-library/react-native";
import React from "react";
import { StreakInitializer } from "./StreakInitializer";

const mockUseInitializeStreak = jest.fn();

jest.mock("@/hooks/useInitializeStreak", () => ({
  useInitializeStreak: () => mockUseInitializeStreak(),
}));

describe("StreakInitializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza sem crash e não exibe nada", () => {
    const { toJSON } = render(<StreakInitializer />);
    expect(toJSON()).toBeNull();
  });

  it("chama o hook useInitializeStreak", () => {
    render(<StreakInitializer />);
    expect(mockUseInitializeStreak).toHaveBeenCalledTimes(1);
  });
});
