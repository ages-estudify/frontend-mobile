import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: (props: any) => <View {...props} /> };
});

jest.mock("@react-navigation/bottom-tabs", () => {
  const { Text } = require("react-native");
  return {
    BottomTabBar: () => <Text>TabBarContent</Text>,
  };
});

import { FloatingGlassTabBar, GlassTabBarBackground } from "./FloatingGlassTabBar";

const makeProps = (): BottomTabBarProps =>
  ({
    state: { index: 0, routes: [] },
    descriptors: {},
    navigation: {},
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  }) as unknown as BottomTabBarProps;

describe("FloatingGlassTabBar", () => {
  it("renderiza a barra de abas embutida", () => {
    render(<FloatingGlassTabBar {...makeProps()} />);
    expect(screen.getByText("TabBarContent")).toBeTruthy();
  });

  it("renderiza sem quebrar", () => {
    const { toJSON } = render(<FloatingGlassTabBar {...makeProps()} />);
    expect(toJSON()).toBeTruthy();
  });
});

describe("GlassTabBarBackground", () => {
  it("renderiza o fundo de vidro sem quebrar", () => {
    const { toJSON } = render(<GlassTabBarBackground />);
    expect(toJSON()).toBeTruthy();
  });
});
