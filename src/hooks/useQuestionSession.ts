import { fetchQuestions, sendAnswer } from '@/services/questionService';
import { Question } from '@/types/Question';
import { useEffect, useState } from 'react';

type QuestionType = "ORIGINAL" | "SIMPLIFIED";

export function useQuestionSession(topicId: string, type: QuestionType) {
    const [queue, setQueue] = useState<Question[]>([]);
    const [cursor, setCursor] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    async function loadQuestions() {

        if (!isFetching || !hasMore) return;

        setIsFetching(true);

        try {
            const response = await fetchQuestions({
                topicId,
                type,
                limit: 10,
                excludeAnswered: true,
            });

            if (response.data === null) {
                setHasMore(false);
                return;
            }

            setQueue(prev => [...prev, ...response.data.questions]);
        } catch (error) {
            console.error("Erro ao buscar questões: ", error);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
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
        setCursor(prev => prev + 1)
    }

    const question = queue[cursor];

    return {
        question,
        selected,
        setSelected,
        confirmAnswer,
        loading,
        isFinished: !hasMore && cursor >= queue.length,
    };
}