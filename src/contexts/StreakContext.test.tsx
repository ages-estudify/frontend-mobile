import { StreakProvider, useStreakContext } from "@/contexts/StreakContext";
import { getUserStreak } from "@/services/streak/streak.service";
import { act, render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

jest.mock("@/services/streak/streak.service", () => ({
  getUserStreak: jest.fn(),
}));

function TestComponent() {
  const { streakDays, streakActive, isLoading, hasError, loadStreak, updateStreak } =
    useStreakContext();

  return (
    <>
      <Text>streakDays:{streakDays ?? "null"}</Text>
      <Text>streakActive:{String(streakActive)}</Text>
      <Text>loading:{String(isLoading)}</Text>
      <Text>error:{String(hasError)}</Text>
      <Text onPress={() => loadStreak()}>load-streak</Text>
      <Text onPress={() => updateStreak({ streakDays: 3, streakActive: true })}>update-streak</Text>
    </>
  );
}

describe("StreakContext", () => {
  const mockedGetUserStreak = getUserStreak as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("atualiza o streak corretamente com updateStreak", async () => {
    render(
      <StreakProvider>
        <TestComponent />
      </StreakProvider>
    );

    expect(screen.getByText("streakDays:null")).toBeTruthy();

    await act(async () => {
      screen.getByText("update-streak").props.onPress();
    });

    expect(screen.getByText("streakDays:3")).toBeTruthy();
    expect(screen.getByText("streakActive:true")).toBeTruthy();
  });

  it("carrega o streak com sucesso usando loadStreak", async () => {
    mockedGetUserStreak.mockResolvedValue({
      streakDays: 7,
      streakActive: true,
    });

    render(
      <StreakProvider>
        <TestComponent />
      </StreakProvider>
    );

    await act(async () => {
      screen.getByText("load-streak").props.onPress();
    });

    expect(screen.getByText("streakDays:7")).toBeTruthy();
    expect(screen.getByText("streakActive:true")).toBeTruthy();
    expect(screen.getByText("loading:false")).toBeTruthy();
    expect(screen.getByText("error:false")).toBeTruthy();
  });

  it("marca erro quando loadStreak falha", async () => {
    mockedGetUserStreak.mockRejectedValue(new Error("Erro ao carregar streak"));

    render(
      <StreakProvider>
        <TestComponent />
      </StreakProvider>
    );

    await act(async () => {
      screen.getByText("load-streak").props.onPress();
    });

    expect(screen.getByText("streakDays:null")).toBeTruthy();
    expect(screen.getByText("streakActive:null")).toBeTruthy();
    expect(screen.getByText("loading:false")).toBeTruthy();
    expect(screen.getByText("error:true")).toBeTruthy();
  });
});
