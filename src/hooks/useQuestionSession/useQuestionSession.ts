import { useStars } from "@/hooks/useStars";
import { useStreak } from "@/hooks/useStreak";
import { getQuestions, postAnswer } from "@/services/question/question.service";
import { AnswerQuestionResponse, Question, QuestionType } from "@/types/questions.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

async function saveFailedAnswer(questionId: string, answer: string) {
  try {
    const storedData = await AsyncStorage.getItem("failedAnswers");
    const failed = storedData ? JSON.parse(storedData) : [];

    failed.push({ questionId, answer });

    await AsyncStorage.setItem("failedAnswers", JSON.stringify(failed));
  } catch {}
}

export function useQuestionSession() {
  const { topicId, type } = useLocalSearchParams<{ topicId: string; type: QuestionType }>();
  const { updateStreak } = useStreak();
  const { updateStars } = useStars();
  const [queue, setQueue] = useState<Question[]>([]);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerQuestionResponse | null>(null);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const answeredQuestionIdsRef = useRef<string[]>([]);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [latestStreak, setLatestStreak] = useState<{
    streakDays: number;
    streakActive: boolean;
  } | null>(null);
  const question = queue[cursor];
  const [progress, setProgress] = useState({
    current: 0,
    total: 20,
  });

  async function loadQuestions() {
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    try {
      const response = await getQuestions({
        topicId,
        type,
        limit: 10,
        excludeAnswered: true,
      });

      if (response.data) {
        setProgress(response.data.sessionProgress);
      }

      if (response.data === null) {
        setHasMore(false);
        return;
      }

      setQueue((prev) => {
        const existingIds = new Set(prev.map((q) => q.id));
        const newQuestions = response.data?.questions.filter((q) => !existingIds.has(q.id)) ?? [];
        return [...prev, ...newQuestions];
      });
    } catch {
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }

  useEffect(() => {
    setQueue([]);
    setCursor(0);
    setSelected(null);
    setHasMore(true);
    setLoading(true);
    setIsFetching(false);
    setFeedback(null);
    setSubmissionError(null);
    setAnsweredQuestionIds([]);
    answeredQuestionIdsRef.current = [];
    setSessionCoins(0);
    setLatestStreak(null);

    loadQuestions();
  }, [topicId, type]);

  useEffect(() => {
    if (hasMore && queue.length - cursor <= 2) {
      loadQuestions();
    }
  }, [cursor, queue]);

  async function confirmAnswer() {
    if (isSubmitting || !selected || !question) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await postAnswer(question.id, selected);
      const feedbackData = response;
      setFeedback(feedbackData);

      if (!answeredQuestionIdsRef.current.includes(question.id)) {
        const nextAnsweredQuestionIds = [...answeredQuestionIdsRef.current, question.id];
        answeredQuestionIdsRef.current = nextAnsweredQuestionIds;
        setAnsweredQuestionIds(nextAnsweredQuestionIds);
        setSessionCoins((prev) => prev + (feedbackData.data?.coinsEarned ?? 0));
      }

      if (
        feedbackData.data?.streakDays !== undefined &&
        feedbackData.data?.streakActive !== undefined
      ) {
        const streak = {
          streakDays: feedbackData.data.streakDays,
          streakActive: feedbackData.data.streakActive,
        };

        setLatestStreak(streak);
        updateStreak(streak);
      }

      if (typeof feedbackData.data?.totalCoins === "number") {
        updateStars(feedbackData.data.totalCoins);
      }

      return feedbackData;
    } catch {
      setSubmissionError("Não foi possível enviar sua resposta. Tente novamente.");
      saveFailedAnswer(question.id, selected);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  function nextQuestion() {
    setFeedback(null);
    setSelected(null);
    setCursor((prev) => prev + 1);

    setProgress((prev) => ({
      ...prev,
      current: prev.current + 1,
    }));
  }
  return {
    question,
    selected,
    setSelected,
    confirmAnswer,
    nextQuestion,
    feedback,
    loading,
    progress,
    isSubmitting,
    submissionError,
    isFinished: !hasMore && cursor >= queue.length,
    isLastQuestion: !hasMore && cursor >= queue.length - 1,
    answeredQuestionIds,
    sessionCoins,
    latestStreak,
  };
}
