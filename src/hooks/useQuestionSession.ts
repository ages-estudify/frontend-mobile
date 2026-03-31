import { fetchQuestions, sendAnswer } from "@/services/questionService";
import { useEffect, useState } from "react";

export function useQuestionSession(topicId: string, type: string) {
  const [queue, setQueue] = useState<any[]>([]);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadQuestions() {
    const res = await fetchQuestions();

    if (!res || !res.data) return;

    setQueue((prev) => [...prev, ...res.data.questions]);
    setLoading(false);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (queue.length - cursor <= 2) {
      loadQuestions();
    }
  }, [cursor]);

  function confirmAnswer() {
    const current = queue[cursor];
    if (!current || !selected) return;

    sendAnswer(current.id, selected);

    setSelected(null);
    setCursor((prev) => prev + 1);
  }

  return {
    question: queue[cursor],
    selected,
    setSelected,
    confirmAnswer,
    loading,
  };
}
