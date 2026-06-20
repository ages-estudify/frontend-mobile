import { render, screen } from "@testing-library/react-native";
import React from "react";
import CronogramaRoute from "../app/(tabs)/cronograma";

jest.mock("@/components/navigation/PlanGuard", () => ({
  PlanGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/components/navigation/GatedTabScreenHeader", () => ({
  GatedTabScreenHeader: ({ title }: { title: string }) => {
    const { Text } = require("react-native");
    return <Text>{title}</Text>;
  },
}));
jest.mock("@/components/navigation/ProfileAvatarButton", () => ({
  ProfileAvatarButton: () => null,
}));
jest.mock("@/components/navigation/TabScreenScrollView", () => ({
  TabScreenScrollView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("@/components/schedule/ScheduleScreen", () => ({
  ScheduleScreen: () => {
    const { Text } = require("react-native");
    return <Text testID="schedule-screen">Schedule</Text>;
  },
}));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("CronogramaRoute", () => {
  it("renderiza o cabeçalho e a tela de cronograma", () => {
    render(<CronogramaRoute />);

    expect(screen.getByText("Cronograma")).toBeTruthy();
    expect(screen.getByTestId("schedule-screen")).toBeTruthy();
  });
});
