import { fetchQuestions, sendAnswer } from "@/services/questionService";
import { Question } from "@/types/Question";
import { useEffect, useState } from "react";

type QuestionType = "ORIGINAL" | "SIMPLIFIED";

export function useQuestionSession(topicId: string, type: QuestionType) {
  const [queue, setQueue] = useState<Question[]>([]);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 20,
  });

  async function loadQuestions() {
    if (isFetching || !hasMore) return;

    setIsFetching(true);

    try {
      const response = await fetchQuestions({
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
        const newQuestions = response.data.questions.filter(
          (q) => !existingIds.has(q.id)
        );
        return [...prev, ...newQuestions];
      });
    } catch (error) {
      console.error("Erro ao buscar questões: ", error);
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

  function saveFailedAnswer(questionId: string, answer: string) {
    try {
      const failed = JSON.parse(localStorage.getItem("failedAnswers") || "[]");

      failed.push({ questionId, answer });

      localStorage.setItem("failedAnswers", JSON.stringify(failed));
    } catch (e) {
      console.error("Erro ao salvar retry: ", e);
    }
  }

  function confirmAnswer() {
    if (isSubmitting) return;

    const current = queue[cursor];
    if (!current || !selected) return;

    const answer = selected;

    setIsSubmitting(true);

    sendAnswer(current.id, answer)
      .catch(() => {
        saveFailedAnswer(current.id, answer);
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    setSelected(null);
    setCursor((prev) => prev + 1);
  }

  const question = queue[cursor];

  return {
    question,
    selected,
    setSelected,
    confirmAnswer,
    loading,
    progress,
    isSubmitting,
    isFinished: !hasMore && cursor >= queue.length,
  };
}
