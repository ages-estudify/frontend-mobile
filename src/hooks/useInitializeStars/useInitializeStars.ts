import { useEffect } from "react";
import { useStars } from "../useStars";

export function useInitializeStars() {
  const { loadStars } = useStars();

  useEffect(() => {
    loadStars();
  }, [loadStars]);
}
