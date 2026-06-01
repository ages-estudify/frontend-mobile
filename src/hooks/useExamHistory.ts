import { examHistoryService } from "@/services/examHistory.service";
import { useCallback, useState } from "react";

export function useExamHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExamHistory = useCallback(async (examId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await examHistoryService.history(examId);
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao carregar histórico");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    getExamHistory,
    clearError,
  };
}
