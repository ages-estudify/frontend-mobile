import { useStreak } from "@/hooks/useStreak";
import { attemptExamService } from "@/services/attemptExam.service";
import { AttemptResponse, Language } from "@/types/exam.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

type CreateAttemptParams = {
  examId: string;
  language: string;
};

type SubmitAnswerParams = {
  questionId: string;
  selectedAnswer: string | null;
  attemptId: string;
  timeSpentSeconds: number;
};

type FinishAttemptParams = {
  attemptId: string;
  timeSpentSeconds: number;
};

export function useExam() {
  const { language, examId, day, examDayId } = useLocalSearchParams<{
    language?: Language;
    examId: string;
    day?: string;
    examDayId?: string;
  }>();
  const { updateStreak } = useStreak();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentAttempt, setCurrentAttempt] = useState<AttemptResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [time, setTime] = useState<string>();

  const startTimestampRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>("active");

  const currentQuestion = currentAttempt?.questions[currentQuestionIndex] || null;

  useEffect(() => {
    if (examId) {
      if (language) {
        createAttempt({ examId, language });
      } else {
        getLatestAttempt(examId);
      }
    }
  }, [examId, day, language]);

  useEffect(() => {
    updateProgress();
  }, [currentAttempt]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    const interval = setInterval(() => {
      updateTimeDisplay();
    }, 1000);

    updateTimeDisplay();

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    appStateRef.current = state;

    if (state === "active") {
      updateTimeDisplay();
    }
  };

  const updateTimeDisplay = () => {
    if (startTimestampRef.current !== null) {
      const elapsedMilliseconds = Date.now() - startTimestampRef.current;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      setSeconds(elapsedSeconds);
      formatTime(elapsedSeconds);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      const selected = currentQuestion.alternatives.find(
        (alt) => alt.id === currentQuestion.selectedAlternativeId
      );
      setSelectedAlternative(selected?.letter || null);
    } else {
      setSelectedAlternative(null);
    }
  }, [currentQuestion]);

  const updateProgress = () => {
    if (currentAttempt) {
      const total = currentAttempt.questions.length;
      const answered = currentAttempt.questions.filter((q) => q.selectedAlternativeId).length;
      setProgress({ current: answered, total });
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");

    if (hours > 0) {
      setTime(`${hours}:${pad(minutes)}:${pad(seconds)}`);
    } else {
      setTime(`${pad(minutes)}:${pad(seconds)}`);
    }
  };

  const createAttempt = async ({ examId, language }: CreateAttemptParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.createAttempt(examId, { language });
      getLatestAttempt(examId);
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao criar tentativa");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLatestAttempt = async (examId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.getLatestAttempt(examId);
      const dayNumber = day ? Number(day) : undefined;
      const filteredQuestions = dayNumber
        ? response.data.questions.filter((q) => q.day === dayNumber)
        : response.data.questions;

      const firstUnansweredIdx = filteredQuestions.findIndex((q) => !q.selectedAlternativeId);
      const initialIndex = dayNumber
        ? Math.max(0, firstUnansweredIdx)
        : response.data.attempt.currentQuestion - 1;

      setCurrentAttempt({ ...response.data, questions: filteredQuestions });
      setCurrentQuestionIndex(initialIndex);
      const timeSpentSeconds = response.data.attempt.timeSpentSeconds;
      setSeconds(timeSpentSeconds);
      startTimestampRef.current = Date.now() - timeSpentSeconds * 1000;
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao buscar tentativa");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async ({
    questionId,
    selectedAnswer,
    attemptId,
    timeSpentSeconds,
  }: SubmitAnswerParams) => {
    try {
      const response = await attemptExamService.submitAnswer(questionId, {
        selectedAnswer,
        attemptId,
        timeSpentSeconds,
      });

      if (response.data?.streakDays !== undefined && response.data?.streakActive !== undefined) {
        updateStreak({
          streakDays: response.data.streakDays,
          streakActive: response.data.streakActive,
        });
      }

      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao enviar resposta");
      throw err;
    }
  };

  const finishAttempt = async ({ attemptId, timeSpentSeconds }: FinishAttemptParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.finishAttempt(attemptId, {
        timeSpentSeconds,
        examDayId,
      });
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao finalizar tentativa");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (selectedAlternativeId: string | null) => {
    if (!currentAttempt) return;

    const updatedQuestions = [...currentAttempt.questions];
    if (selectedAlternativeId) {
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        selectedAlternativeId: selectedAlternativeId,
      };
    }

    setCurrentAttempt({
      ...currentAttempt,
      questions: updatedQuestions,
    });
  };

  const prevQuestion = (selectedAlternativeId: string | null) => {
    updateAnswer(selectedAlternativeId);

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const nextQuestion = (selectedAlternativeId: string | null) => {
    if (!currentAttempt) return;

    updateAnswer(selectedAlternativeId);

    if (currentQuestionIndex < currentAttempt.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToQuestion = (index: number, selectedAlternativeId: string | null) => {
    if (!currentAttempt) return;

    updateAnswer(selectedAlternativeId);
    setCurrentQuestionIndex(index);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    currentAttempt,
    progress,
    currentQuestion,
    selectedAlternative,
    time,
    seconds,
    currentQuestionIndex,
    error,
    setSelectedAlternative,
    createAttempt,
    getLatestAttempt,
    submitAnswer,
    finishAttempt,
    prevQuestion,
    nextQuestion,
    goToQuestion,
    clearError,
  };
}
