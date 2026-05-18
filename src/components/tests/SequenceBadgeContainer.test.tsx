import { SequenceBadgeContainer } from "@/components/SequenceBadgeContainer";
import { useStreak } from "@/hooks/useStreak";
import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

jest.mock("@/hooks/useStreak", () => ({
  useStreak: jest.fn(),
}));

jest.mock("@/components/SequenceBadge", () => ({
  SequenceBadge: ({ sequence, streakActive, isLoading, hasError, description }: any) => (
    <Text>
      seq:{sequence ?? "null"} status:{String(streakActive)} loading:{String(isLoading)} error:
      {String(hasError)} desc:{description}
    </Text>
  ),
}));

const mockedUseStreak = useStreak as jest.Mock;

describe("SequenceBadgeContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("carrega streak ao montar quando ainda não foi carregado", async () => {
    const loadStreak = jest.fn();

    mockedUseStreak.mockReturnValue({
      streakDays: null,
      streakActive: null,
      isLoading: false,
      hasError: false,
      loadStreak,
    });

    render(<SequenceBadgeContainer variant="treinar" />);

    await waitFor(() => {
      expect(loadStreak).toHaveBeenCalled();
    });
  });

  it("passa valores de streak para SequenceBadge", () => {
    mockedUseStreak.mockReturnValue({
      streakDays: 5,
      streakActive: true,
      isLoading: false,
      hasError: false,
      loadStreak: jest.fn(),
    });

    render(<SequenceBadgeContainer variant="progresso" />);

    expect(screen.getByText(/seq:5/)).toBeTruthy();
    expect(screen.getByText(/status:true/)).toBeTruthy();
    expect(
      screen.getByText(/desc:Representa quantos dias consecutivos você tem estudado na plataforma./)
    ).toBeTruthy();
  });
});
