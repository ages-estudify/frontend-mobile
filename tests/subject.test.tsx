import { getTopicsBySubject } from "@/services/subject/subject.service";
import type { Topic } from "@/types/subject.types";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react-native";
import * as ExpoRouter from "expo-router";
import React from "react";
import SubjectScreen from "../app/subject";

jest.mock("@/services/subject/subject.service", () => ({
  getTopicsBySubject: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("@/components/BackButton", () => {
  const React = jest.requireActual("react");
  const { Text } = jest.requireActual("react-native");
  return { BackButton: () => <Text>BackButton</Text> };
});

jest.mock("@/components/QuestionTypeBottomSheet", () => {
  const React = jest.requireActual("react");
  const { Pressable, Text, View } = jest.requireActual("react-native");
  return {
    QuestionTypeBottomSheet: ({
      onOriginalPress,
      onSimplifiedPress,
    }: {
      onOriginalPress?: () => void;
      onSimplifiedPress?: () => void;
    }) => (
      <View>
        <Pressable onPress={onOriginalPress} accessibilityLabel="Treino original" />
        <Pressable onPress={onSimplifiedPress} accessibilityLabel="Treino simplificado" />
        <Text>BottomSheet</Text>
      </View>
    ),
  };
});

jest.mock("../assets/icons/separator.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockTopicSeparator() {
    return <View testID="topic-separator" />;
  }
  return MockTopicSeparator;
});

const mockGetTopics = jest.mocked(getTopicsBySubject);

function makeTopic(overrides: Partial<Topic> = {}): Topic {
  return {
    id: "t1",
    name: "Álgebra",
    icon_url: "https://example.com/icon.png",
    text: "Introdução às funções",
    availableByType: { ORIGINAL: 10, SIMPLIFIED: 10 },
    answeredByType: { ORIGINAL: 5, SIMPLIFIED: 5 },
    ...overrides,
  };
}

describe("SubjectScreen (app/subject)", () => {
  const mockNavigate = jest.fn();

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(ExpoRouter.useLocalSearchParams).mockReturnValue({
      id: "sub-1",
      name: "Matemática",
    });
    jest.mocked(ExpoRouter.useRouter).mockReturnValue({
      navigate: mockNavigate,
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    } as ReturnType<typeof ExpoRouter.useRouter>);
    mockGetTopics.mockResolvedValue([]);
  });

  it("loads topics for the route id and shows the subject name", async () => {
    mockGetTopics.mockResolvedValue([makeTopic()]);

    render(<SubjectScreen />);

    expect(screen.getByText("TRILHA SUGERIDA")).toBeTruthy();
    expect(screen.getByText("Matemática")).toBeTruthy();

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalledWith("sub-1");
    });

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });
  });

  it("renders a separator between multiple topics", async () => {
    mockGetTopics.mockResolvedValue([
      makeTopic({ id: "a", name: "A" }),
      makeTopic({ id: "b", name: "B" }),
    ]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("B")).toBeTruthy();
    });

    const scroll = screen.getByTestId("subject-topics-scroll");
    expect(within(scroll).getAllByTestId("topic-separator")).toHaveLength(1);
  });

  it("navigates to questions with topic id and type when bottom sheet actions fire", async () => {
    mockGetTopics.mockResolvedValue([makeTopic({ id: "topic-x" })]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Álgebra"));

    fireEvent.press(screen.getByLabelText("Treino original"));
    expect(mockNavigate).toHaveBeenCalledWith("/questions?topicId=topic-x&type=ORIGINAL");

    fireEvent.press(screen.getByLabelText("Treino simplificado"));
    expect(mockNavigate).toHaveBeenCalledWith("/questions?topicId=topic-x&type=SIMPLIFIED");
  });

  it("shows progress on TopicStep when the topic is partially complete", async () => {
    mockGetTopics.mockResolvedValue([
      makeTopic({
        availableByType: { ORIGINAL: 4, SIMPLIFIED: 0 },
        answeredByType: { ORIGINAL: 2, SIMPLIFIED: 0 },
      }),
    ]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("Etapa 01 - EM ANDAMENTO · 50%")).toBeTruthy();
    });
  });
});
