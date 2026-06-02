import { getUserStreak } from "@/services/streak/streak.service";
import type { GetStreakResponse } from "@/types/streak.types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface StreakContextType {
  streakDays: number | null;
  streakActive: boolean | null;
  isLoading: boolean;
  hasError: boolean;
  loadStreak: () => Promise<void>;
  updateStreak: (value: { streakDays: number; streakActive: boolean }) => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

interface StreakProviderProps {
  children: ReactNode;
}

export function StreakProvider({ children }: StreakProviderProps) {
  const [streakDays, setStreakDays] = useState<number | null>(null);
  const [streakActive, setStreakActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadStreak = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response: GetStreakResponse = await getUserStreak();
      setStreakDays(response.streakDays);
      setStreakActive(response.streakActive);
      setHasError(false);
    } catch {
      setStreakDays(null);
      setStreakActive(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStreak = useCallback(
    ({ streakDays, streakActive }: { streakDays: number; streakActive: boolean }) => {
      setStreakDays(streakDays);
      setStreakActive(streakActive);
      setHasError(false);
    },
    []
  );

  const value = useMemo(
    () => ({
      streakDays,
      streakActive,
      isLoading,
      hasError,
      loadStreak,
      updateStreak,
    }),
    [streakDays, streakActive, isLoading, hasError, loadStreak, updateStreak]
  );

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreakContext() {
  const context = useContext(StreakContext);

  if (!context) {
    throw new Error("useStreakContext must be used within StreakProvider");
  }

  return context;
}
