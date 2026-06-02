import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import { TabScreenScrollView } from "./TabScreenScrollView";

describe("TabScreenScrollView", () => {
  it("renderiza os filhos", () => {
    render(
      <TabScreenScrollView>
        <Text>Conteúdo</Text>
      </TabScreenScrollView>
    );
    expect(screen.getByText("Conteúdo")).toBeTruthy();
  });

  it("aceita contentContainerStyle sem quebrar", () => {
    const { toJSON } = render(
      <TabScreenScrollView contentContainerStyle={{ padding: 8 }}>
        <Text>Item</Text>
      </TabScreenScrollView>
    );
    expect(toJSON()).toBeTruthy();
    expect(screen.getByText("Item")).toBeTruthy();
  });

  it("repassa props extras de ScrollView", () => {
    render(
      <TabScreenScrollView testID="scroll" horizontal>
        <Text>X</Text>
      </TabScreenScrollView>
    );
    expect(screen.getByTestId("scroll")).toBeTruthy();
  });
});
