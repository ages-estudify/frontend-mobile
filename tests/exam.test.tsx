import { useExam } from "@/hooks/useExam";
import { render, screen } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
import ExamScreen from "../app/exam";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
    isAxiosError: jest.fn(),
  },
  isAxiosError: jest.fn(),
}));

jest.mock("@/hooks/useExam");
jest.mock("expo-router");

class MockBackButton extends React.Component<any> {
  static displayName = "BackButton";
  render() {
    const { onPress } = this.props;
    return (
      <Text testID="back-button" onPress={onPress}>
        Back
      </Text>
    );
  }
}

class MockQuestionCard extends React.Component<any> {
  static displayName = "QuestionCard";
  render() {
    const { question } = this.props;
    return <Text testID="question-card">{question?.text}</Text>;
  }
}

class MockQuestionAlternatives extends React.Component<any> {
  static displayName = "QuestionAlternatives";
  render() {
    const { setSelected } = this.props;
    return (
      <Text testID="alternatives" onPress={() => setSelected("A")}>
        Alternatives
      </Text>
    );
  }
}

class MockQuestionProgress extends React.Component<any> {
  static displayName = "QuestionProgress";
  render() {
    const { progress } = this.props;
    return (
      <Text testID="progress">
        {progress?.current}/{progress?.total}
      </Text>
    );
  }
}

class MockTimerExam extends React.Component<any> {
  static displayName = "TimerExam";
  render() {
    const { time } = this.props;
    return <Text testID="timer">{time}</Text>;
  }
}

class MockQuestionGridModal extends React.Component<any> {
  static displayName = "QuestionGridModal";
  render() {
    const { visible, onFinishExam } = this.props;
    return visible ? (
      <Text testID="grid-modal" onPress={onFinishExam}>
        Finish
      </Text>
    ) : null;
  }
}

class MockFinishExamModal extends React.Component<any> {
  static displayName = "FinishExamModal";
  render() {
    const { visible, onConfirm, onCancel } = this.props;
    return visible ? (
      <>
        <Text testID="finish-modal">Confirm Finish</Text>
        <Text testID="confirm-button" onPress={onConfirm}>
          Confirm
        </Text>
        <Text testID="cancel-button" onPress={onCancel}>
          Cancel
        </Text>
      </>
    ) : null;
  }
}

jest.mock("@/components/BackButton", () => ({
  BackButton: MockBackButton,
}));
jest.mock("@/components/QuestionCard", () => ({
  __esModule: true,
  default: MockQuestionCard,
}));
jest.mock("@/components/QuestionAlternatives", () => ({
  __esModule: true,
  default: MockQuestionAlternatives,
}));
jest.mock("@/components/QuestionProgress", () => ({
  __esModule: true,
  default: MockQuestionProgress,
}));
jest.mock("@/components/TimerExam", () => ({
  __esModule: true,
  default: MockTimerExam,
}));
jest.mock("@/components/QuestionGridModal", () => ({
  QuestionGridModal: MockQuestionGridModal,
}));
jest.mock("@/components/FinishExamModal", () => ({
  FinishExamModal: MockFinishExamModal,
}));

describe("ExamScreen", () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  const mockExamHook = {
    loading: false,
    currentAttempt: {
      attempt: {
        id: "attempt-123",
        examId: "exam-123",
        currentQuestion: 1,
        timeSpentMinutes: 0,
        language: "ENGLISH",
        initTime: "2026-03-12",
        endTime: null,
      },
      questions: [
        {
          id: "q-1",
          number: 1,
          text: "Question 1",
          imageUrl: null,
          day: "1",
          alternatives: [
            { id: "a-1", letter: "A", text: "Option A" },
            { id: "a-2", letter: "B", text: "Option B" },
          ],
          selectedAlternativeId: null,
        },
        {
          id: "q-2",
          number: 2,
          text: "Question 2",
          imageUrl: null,
          day: "1",
          alternatives: [{ id: "a-3", letter: "A", text: "Option A" }],
          selectedAlternativeId: "a-3",
        },
      ],
    },
    progress: { current: 1, total: 2 },
    currentQuestion: {
      id: "q-1",
      number: 1,
      text: "Question 1",
      imageUrl: null,
      day: "1",
      alternatives: [
        { id: "a-1", letter: "A", text: "Option A" },
        { id: "a-2", letter: "B", text: "Option B" },
      ],
      selectedAlternativeId: null,
    },
    selectedAlternative: null,
    time: "00:00",
    seconds: 0,
    error: null,
    setSelectedAlternative: jest.fn(),
    createAttempt: jest.fn(),
    getLatestAttempt: jest.fn(),
    submitAnswer: jest.fn(),
    pauseAttempt: jest.fn(),
    finishAttempt: jest.fn(),
    prevQuestion: jest.fn(),
    nextQuestion: jest.fn(),
    goToQuestion: jest.fn(),
    clearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useExam as jest.Mock).mockReturnValue(mockExamHook);
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
  });

  it("should render loading state", () => {
    (useExam as jest.Mock).mockReturnValue({
      ...mockExamHook,
      loading: true,
    });

    render(<ExamScreen />);
    expect(screen.queryByTestId("question-card")).toBeNull();
  });

  it("should render error state", () => {
    (useExam as jest.Mock).mockReturnValue({
      ...mockExamHook,
      error: "Failed to load exam",
    });

    render(<ExamScreen />);
    expect(screen.getByText("Failed to load exam")).toBeTruthy();
  });
});
