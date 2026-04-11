import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "hasSeenIntroSlider";
const ALREADY_SEEN = "true";

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(STORAGE_KEY);
        setIsFirstLaunch(hasSeen !== ALREADY_SEEN);
      } catch (error) {
        console.error("Erro ao ler do AsyncStorage:", error);
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const completeIntro = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, ALREADY_SEEN);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error("Erro ao salvar no AsyncStorage:", error);
    }
  }, []);

  return { isFirstLaunch, isLoading, completeIntro };
}
