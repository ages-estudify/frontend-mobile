import { useStreak } from "@/hooks/useStreak";
import { useEffect } from "react";

export function useInitializeStreak() {
  const { loadStreak } = useStreak();

  useEffect(() => {
    void loadStreak();
  }, [loadStreak]);
}
