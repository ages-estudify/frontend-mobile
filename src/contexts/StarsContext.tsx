import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getUserStars } from "@/services/stars.service";

interface StarsContextType {
  stars: number | null;
  isLoading: boolean;
  hasError: boolean;
  loadStars: () => Promise<void>;
  updateStars: (totalStars: number) => void;
}

const StarsContext = createContext<StarsContextType | undefined>(undefined);

interface StarsProviderProps {
  children: ReactNode;
}

export function StarsProvider({ children }: StarsProviderProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadStars = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await getUserStars();
      setStars(response.data.coins);
      setHasError(false);
    } catch {
      setStars(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStars = useCallback((totalStars: number) => {
    setStars(totalStars);
    setHasError(false);
  }, []);

  const value = useMemo(
    () => ({
      stars,
      isLoading,
      hasError,
      loadStars,
      updateStars,
    }),
    [stars, isLoading, hasError, loadStars, updateStars]
  );

  return <StarsContext.Provider value={value}>{children}</StarsContext.Provider>;
}

export function useStarsContext() {
  const context = useContext(StarsContext);

  if (!context) {
    throw new Error("useStarsContext must be used within StarsProvider");
  }

  return context;
}
