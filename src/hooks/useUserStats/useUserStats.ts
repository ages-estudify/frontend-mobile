import { usersStatsService } from "@/services/usersStats/usersStats.service";
import { UserStatsData } from "@/types/userStats";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useUserStats() {
  const [data, setData] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else if (!data) {
        setLoading(true);
      }
      setError(false);

      try {
        const result = await usersStatsService.getUserStats();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [data]
  );

  const refreshStats = useCallback(() => {
    fetchStats(true);
  }, [fetchStats]);

  const retry = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  return {
    data,
    loading,
    error,
    refreshing,
    fetchStats,
    refreshStats,
    retry,
  };
}
