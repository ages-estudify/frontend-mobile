import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { GatedTabScreenHeader } from "./GatedTabScreenHeader";

describe("GatedTabScreenHeader", () => {
  it("renderiza o título", () => {
    render(<GatedTabScreenHeader title="Treinar" />);
    expect(screen.getByText("Treinar")).toBeTruthy();
  });

  it("renderiza o conteúdo trailing quando fornecido", () => {
    render(<GatedTabScreenHeader title="Treinar" trailing={<Text>Avatar</Text>} />);
    expect(screen.getByText("Avatar")).toBeTruthy();
    expect(screen.getByText("Treinar")).toBeTruthy();
  });

  it("renderiza sem trailing sem quebrar", () => {
    const { toJSON } = render(<GatedTabScreenHeader title="Treinar" />);
    expect(toJSON()).toBeTruthy();
    expect(screen.queryByText("Avatar")).toBeNull();
  });
});
