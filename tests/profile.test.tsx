import { render, screen } from "@testing-library/react-native";
import React from "react";
import ProfileRoute from "../app/profile";

jest.mock("@/components/Profile/ProfileScreen/ProfileScreen", () => ({
  ProfileScreen: () => {
    const { Text } = require("react-native");
    return <Text testID="profile-screen">Perfil</Text>;
  },
}));

describe("ProfileRoute", () => {
  it("renderiza a tela de perfil", () => {
    render(<ProfileRoute />);

    expect(screen.getByTestId("profile-screen")).toBeTruthy();
    expect(screen.getByText("Perfil")).toBeTruthy();
  });
});
