import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
  };
});

import Index from "./index";

describe("Index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redireciona para a área logada quando há token armazenado", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("fake-token");

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByTestId("redirect")).toHaveTextContent("/(tabs)/treinar");
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("token");
  });

  it("redireciona para o login quando não há token", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<Index />);

    await waitFor(() => {
      expect(screen.getByTestId("redirect")).toHaveTextContent("/login");
    });
  });

  it("não renderiza nada enquanto o token não foi resolvido", () => {
    (AsyncStorage.getItem as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<Index />);

    expect(screen.queryByTestId("redirect")).toBeNull();
  });
});
