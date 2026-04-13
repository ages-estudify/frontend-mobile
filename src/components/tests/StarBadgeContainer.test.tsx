import React from "react";
import { render, screen } from "@testing-library/react-native";
import { StarBadgeContainer } from "@/components/StarBadgeContainer";
import { useStars } from "@/hooks/useStars";

jest.mock("@/hooks/useStars", () => ({
  useStars: jest.fn(),
}));

jest.mock("@/components/StarBadge", () => {
  const React = jest.requireActual("react");
  const { Text } = jest.requireActual("react-native");

  return {
    StarBadge: ({
      stars,
      isLoading,
      hasError,
      description,
    }: {
      stars: number | null;
      isLoading: boolean;
      hasError: boolean;
      description?: string;
    }) => (
      <>
        <Text>stars:{stars ?? "null"}</Text>
        <Text>loading:{String(isLoading)}</Text>
        <Text>error:{String(hasError)}</Text>
        <Text>description:{description ?? ""}</Text>
      </>
    ),
  };
});

describe("StarBadgeContainer", () => {
  const mockedUseStars = useStars as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passa a descrição correta para a variant "treinar"', () => {
    mockedUseStars.mockReturnValue({
      stars: 12,
      isLoading: false,
      hasError: false,
    });

    render(<StarBadgeContainer variant="treinar" />);

    expect(screen.getByText("stars:12")).toBeTruthy();
    expect(screen.getByText("loading:false")).toBeTruthy();
    expect(screen.getByText("error:false")).toBeTruthy();
    expect(screen.getByText("description:Responda questões e ganhe mais")).toBeTruthy();
  });

  it('passa a descrição correta para a variant "progresso"', () => {
    mockedUseStars.mockReturnValue({
      stars: 30,
      isLoading: false,
      hasError: false,
    });

    render(<StarBadgeContainer variant="progresso" />);

    expect(screen.getByText("stars:30")).toBeTruthy();
    expect(
      screen.getByText("description:Representa o número total de questões que você já respondeu.")
    ).toBeTruthy();
  });

  it("repassa corretamente loading e erro vindos do hook", () => {
    mockedUseStars.mockReturnValue({
      stars: null,
      isLoading: true,
      hasError: true,
    });

    render(<StarBadgeContainer variant="treinar" />);

    expect(screen.getByText("stars:null")).toBeTruthy();
    expect(screen.getByText("loading:true")).toBeTruthy();
    expect(screen.getByText("error:true")).toBeTruthy();
    expect(screen.getByText("description:Responda questões e ganhe mais")).toBeTruthy();
  });
});
