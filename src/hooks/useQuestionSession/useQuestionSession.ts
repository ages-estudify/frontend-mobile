import { useStreak } from "@/hooks/useStreak";
import { getQuestions, postAnswer } from "@/services/question/question.service";
import { AnswerQuestionResponse, Question, QuestionType } from "@/types/questions.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

async function saveFailedAnswer(questionId: string, answer: string) {
  try {
    const storedData = await AsyncStorage.getItem("failedAnswers");
    const failed = storedData ? JSON.parse(storedData) : [];

    failed.push({ questionId, answer });

    await AsyncStorage.setItem("failedAnswers", JSON.stringify(failed));
  } catch (e) {}
}

export function useQuestionSession() {
  const { topicId, type } = useLocalSearchParams<{ topicId: string; type: QuestionType }>();
  const { updateStreak } = useStreak();
  const [queue, setQueue] = useState<Question[]>([]);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnswerQuestionResponse | null>(null);
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
    } catch (error) {
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

    try {
      const response = await postAnswer(question.id, selected);
      const feedbackData = response;
      setFeedback(feedbackData);

      if (
        feedbackData.data?.streakDays !== undefined &&
        feedbackData.data?.streakActive !== undefined
      ) {
        updateStreak({
          streakDays: feedbackData.data.streakDays,
          streakActive: feedbackData.data.streakActive,
        });
      }

      return feedbackData;
    } catch (error) {
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
    isFinished: !hasMore && cursor >= queue.length,
  };
}
