import { getSubjects } from "@/services/subject/subject.service";
import { render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import TreinarRoute from "../app/(tabs)/treinar";

jest.mock("@/services/subject/subject.service", () => ({
  getSubjects: jest.fn(),
}));
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
jest.mock("@/components/SequenceBadgeContainer", () => ({
  SequenceBadgeContainer: () => null,
}));
jest.mock("@/components/StarBadgeContainer", () => ({
  StarBadgeContainer: () => null,
}));
jest.mock("@/components/SubjectsGrid", () => ({
  SubjectsGrid: ({ subjects }: { subjects: { name: string }[] }) => {
    const { Text } = require("react-native");
    return <Text testID="subjects-grid">{subjects.map((subject) => subject.name).join(",")}</Text>;
  },
}));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => void) => {
    const ReactModule = require("react");
    ReactModule.useEffect(() => callback(), [callback]);
  },
}));
jest.mock("@/hooks/useStars", () => ({
  useStars: () => ({ loadStars: jest.fn() }),
}));
jest.mock("@/hooks/useStreak", () => ({
  useStreak: () => ({ loadStreak: jest.fn() }),
}));

const mockGetSubjects = getSubjects as jest.Mock;

describe("TreinarRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza o cabeçalho e carrega as disciplinas", async () => {
    mockGetSubjects.mockResolvedValueOnce([
      { id: "1", name: "Matemática" },
      { id: "2", name: "Português" },
    ]);

    render(<TreinarRoute />);

    expect(screen.getByText("Treinar")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("subjects-grid").props.children).toBe("Matemática,Português");
    });
  });

  it("mostra lista vazia quando a busca de disciplinas falha", async () => {
    mockGetSubjects.mockRejectedValueOnce(new Error("Network error"));

    render(<TreinarRoute />);

    await waitFor(() => {
      expect(screen.getByTestId("subjects-grid").props.children).toBe("");
    });
  });
});
