import { attemptExamService } from "@/services/attemptExam.service";
import { AttemptResponse, Language } from "@/types/exam.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

type CreateAttemptParams = {
  examId: string;
  language: string;
};

type SubmitAnswerParams = {
  questionId: string;
  selectedAnswer: string;
  attemptId: string;
};

type PauseAttemptParams = {
  attemptId: string;
  timeSpentMinutes: number;
};

type FinishAttemptParams = {
  attemptId: string;
  timeSpentMinutes: number;
};

export function useExam() {
  const { language, examId } = useLocalSearchParams<{ language?: Language; examId: string }>();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentAttempt, setCurrentAttempt] = useState<AttemptResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);

  const currentQuestion = currentAttempt?.questions[currentQuestionIndex] || null;

  useEffect(() => {
    if (examId) {
      if (language) {
        createAttempt({ examId, language });
      } else {
        getLatestAttempt(examId);
      }
    }
  }, [examId]);

  useEffect(() => {
    updateProgress();
  }, [currentAttempt]);

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

  const createAttempt = async ({ examId, language }: CreateAttemptParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.createAttempt(examId, { language });
      setCurrentAttempt(response.data);
      setCurrentQuestionIndex(0);
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
      setCurrentAttempt(response.data);
      setCurrentQuestionIndex(response.data.attempt.currentQuestion);
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao buscar tentativa");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async ({ questionId, selectedAnswer, attemptId }: SubmitAnswerParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.submitAnswer(questionId, {
        selectedAnswer,
        attemptId,
      });
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao enviar resposta");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pauseAttempt = async ({ attemptId, timeSpentMinutes }: PauseAttemptParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.pauseAttempt(attemptId, {
        timeSpentMinutes,
      });
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao pausar tentativa");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishAttempt = async ({ attemptId, timeSpentMinutes }: FinishAttemptParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await attemptExamService.finishAttempt(attemptId, {
        timeSpentMinutes,
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

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    currentAttempt,
    progress,
    currentQuestion,
    selectedAlternative,
    setSelectedAlternative,
    error,
    createAttempt,
    getLatestAttempt,
    submitAnswer,
    pauseAttempt,
    finishAttempt,
    prevQuestion,
    nextQuestion,
    clearError,
  };
}
