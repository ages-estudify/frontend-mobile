import React from "react";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { StarsProvider, useStarsContext } from "./StarsContext";
import { getUserStars } from "@/services/stars/stars.service";

jest.mock("@/services/stars/stars.service", () => ({
  getUserStars: jest.fn(),
}));

function TestComponent() {
  const { stars, isLoading, hasError, loadStars, updateStars } = useStarsContext();

  return (
    <>
      <Text>stars:{stars ?? "null"}</Text>
      <Text>loading:{String(isLoading)}</Text>
      <Text>error:{String(hasError)}</Text>
      <Text onPress={() => loadStars()}>load-stars</Text>
      <Text onPress={() => updateStars(99)}>update-stars</Text>
    </>
  );
}

describe("StarsContext", () => {
  const mockedGetUserStars = getUserStars as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("atualiza as stars corretamente com updateStars", async () => {
    render(
      <StarsProvider>
        <TestComponent />
      </StarsProvider>
    );

    expect(screen.getByText("stars:null")).toBeTruthy();

    await act(async () => {
      screen.getByText("update-stars").props.onPress();
    });

    expect(screen.getByText("stars:99")).toBeTruthy();
    expect(screen.getByText("error:false")).toBeTruthy();
  });

  it("carrega as stars com sucesso usando loadStars", async () => {
    mockedGetUserStars.mockResolvedValue({
      data: {
        coins: 47,
      },
    });

    render(
      <StarsProvider>
        <TestComponent />
      </StarsProvider>
    );

    await act(async () => {
      screen.getByText("load-stars").props.onPress();
    });

    expect(screen.getByText("stars:47")).toBeTruthy();
    expect(screen.getByText("loading:false")).toBeTruthy();
    expect(screen.getByText("error:false")).toBeTruthy();
  });

  it("marca erro quando loadStars falha", async () => {
    mockedGetUserStars.mockRejectedValue(new Error("Erro ao carregar stars"));

    render(
      <StarsProvider>
        <TestComponent />
      </StarsProvider>
    );

    await act(async () => {
      screen.getByText("load-stars").props.onPress();
    });

    expect(screen.getByText("stars:null")).toBeTruthy();
    expect(screen.getByText("loading:false")).toBeTruthy();
    expect(screen.getByText("error:true")).toBeTruthy();
  });

  it("lanca erro se usado fora de StarsProvider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      "useStarsContext must be used within StarsProvider"
    );
    consoleError.mockRestore();
  });
});
