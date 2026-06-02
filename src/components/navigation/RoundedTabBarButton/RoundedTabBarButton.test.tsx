import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

jest.mock("@react-navigation/elements", () => {
  const { Pressable } = require("react-native");
  return {
    PlatformPressable: ({ children, ...rest }: any) => <Pressable {...rest}>{children}</Pressable>,
  };
});

import { RoundedTabBarButton } from "./RoundedTabBarButton";

describe("RoundedTabBarButton", () => {
  it("renderiza os filhos", () => {
    render(
      <RoundedTabBarButton>
        <Text>Início</Text>
      </RoundedTabBarButton>
    );
    expect(screen.getByText("Início")).toBeTruthy();
  });

  it("aplica fundo ativo quando selecionado (smoke)", () => {
    const { toJSON } = render(
      <RoundedTabBarButton accessibilityState={{ selected: true }}>
        <Text>Treinar</Text>
      </RoundedTabBarButton>
    );
    expect(toJSON()).toBeTruthy();
    expect(screen.getByText("Treinar")).toBeTruthy();
  });

  it("chama onPress ao pressionar", () => {
    const onPress = jest.fn();
    render(
      <RoundedTabBarButton onPress={onPress}>
        <Text>Perfil</Text>
      </RoundedTabBarButton>
    );
    fireEvent.press(screen.getByText("Perfil"));
    expect(onPress).toHaveBeenCalled();
  });
});
