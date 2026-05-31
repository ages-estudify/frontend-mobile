import { getTopicsBySubject } from "@/services/subject/subject.service";
import type { Topic } from "@/types/subject.types";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react-native";
import * as ExpoRouter from "expo-router";
import React from "react";
import SubjectScreen from "../app/subject";

jest.mock("@/services/subject/subject.service", () => ({
  getTopicsBySubject: jest.fn(),
}));

jest.mock("expo-router", () => {
  const ReactActual = jest.requireActual("react");
  return {
    useLocalSearchParams: jest.fn(),
    useRouter: jest.fn(),
    useFocusEffect: (callback: () => void) => ReactActual.useEffect(callback, [callback]),
  };
});

jest.mock("../assets/icons/fire.svg", () => {
  const React = jest.requireActual("react");
  const { View } = jest.requireActual("react-native");
  function MockFire() {
    return <View testID="fire-icon" />;
  }
  return MockFire;
});

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

jest.mock("@/contexts/StarsContext", () => {
  const loadStars = jest.fn();
  const updateStars = jest.fn();
  const value = { stars: 0, isLoading: false, hasError: false, loadStars, updateStars };
  return { useStarsContext: () => value };
});

const mockUseStreak = jest.fn();
jest.mock("@/hooks/useStreak", () => ({
  useStreak: () => mockUseStreak(),
}));

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
    mockUseStreak.mockReturnValue({
      streakDays: null,
      streakActive: null,
      isLoading: false,
      hasError: false,
      loadStreak: jest.fn(),
      updateStreak: jest.fn(),
    });
  });

  it("loads topics for the route id and shows the subject name", async () => {
    mockGetTopics.mockResolvedValue([makeTopic()]);

    render(<SubjectScreen />);

    expect(screen.getByText("Matemática")).toBeTruthy();

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalledWith("sub-1");
    });

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });
  });

  it("renders a trail node for each topic", async () => {
    mockGetTopics.mockResolvedValue([
      makeTopic({ id: "a", name: "A" }),
      makeTopic({ id: "b", name: "B" }),
    ]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("B")).toBeTruthy();
    });

    const scroll = screen.getByTestId("topic-trail-scroll");
    expect(within(scroll).getAllByTestId(/^topic-trail-node-/)).toHaveLength(2);
  });

  it("navigates to questions with topic id and type when bottom sheet actions fire", async () => {
    mockGetTopics.mockResolvedValue([makeTopic({ id: "topic-x" })]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Álgebra"));

    fireEvent.press(screen.getByLabelText("Treino original"));
    expect(mockNavigate).toHaveBeenCalledWith("/question?topicId=topic-x&type=ORIGINAL");

    fireEvent.press(screen.getByLabelText("Treino simplificado"));
    expect(mockNavigate).toHaveBeenCalledWith("/question?topicId=topic-x&type=SIMPLIFIED");
  });

  it("shows the topic stage and progress percentage when partially complete", async () => {
    mockGetTopics.mockResolvedValue([
      makeTopic({
        availableByType: { ORIGINAL: 4, SIMPLIFIED: 0 },
        answeredByType: { ORIGINAL: 2, SIMPLIFIED: 0 },
      }),
    ]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("Etapa 01")).toBeTruthy();
    });
    expect(screen.getByText("50%")).toBeTruthy();
  });

  it("renders a topic with no questions at 0% progress", async () => {
    mockGetTopics.mockResolvedValue([
      makeTopic({ availableByType: undefined, answeredByType: undefined }),
    ]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });
    expect(screen.getByText("0%")).toBeTruthy();
  });

  it("shows the empty state when the subject has no topics", async () => {
    mockGetTopics.mockResolvedValue([]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("subject-trail-empty")).toBeTruthy();
    });
    expect(screen.getByText("Nenhum tópico disponível para esta disciplina.")).toBeTruthy();
  });

  it("shows the error state and reloads the topics on retry", async () => {
    mockGetTopics.mockRejectedValueOnce(new Error("network"));
    mockGetTopics.mockResolvedValueOnce([makeTopic()]);

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("subject-trail-error")).toBeTruthy();
    });
    expect(screen.getByText("Não foi possível carregar os tópicos. Tente novamente.")).toBeTruthy();

    fireEvent.press(screen.getByTestId("subject-trail-retry"));

    await waitFor(() => {
      expect(screen.getByText("Álgebra")).toBeTruthy();
    });
  });

  it("does not fetch topics when the route has no subject id", () => {
    jest.mocked(ExpoRouter.useLocalSearchParams).mockReturnValue({});

    render(<SubjectScreen />);

    expect(mockGetTopics).not.toHaveBeenCalled();
    expect(screen.getByTestId("subject-trail-loading")).toBeTruthy();
  });

  it("shows the streak value from the StreakContext in the stats card", async () => {
    mockGetTopics.mockResolvedValue([makeTopic()]);
    mockUseStreak.mockReturnValue({
      streakDays: 10,
      streakActive: true,
      isLoading: false,
      hasError: false,
      loadStreak: jest.fn(),
      updateStreak: jest.fn(),
    });

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("10 dias")).toBeTruthy();
    });
  });

  it("falls back to 0 dias when the streak is not loaded yet", async () => {
    mockGetTopics.mockResolvedValue([makeTopic()]);
    mockUseStreak.mockReturnValue({
      streakDays: null,
      streakActive: null,
      isLoading: false,
      hasError: false,
      loadStreak: jest.fn(),
      updateStreak: jest.fn(),
    });

    render(<SubjectScreen />);

    await waitFor(() => {
      expect(screen.getByText("0 dias")).toBeTruthy();
    });
  });
});
