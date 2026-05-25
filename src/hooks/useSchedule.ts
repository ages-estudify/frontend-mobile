import { scheduleService } from "@/services/schedule.service";
import type { ScheduleDay, ScheduleItem, ScheduleWeek } from "@/types/schedule.types";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseScheduleResult = {
  weekStart: string;
  weekEnd: string;
  scheduleStartDate: string | null;
  days: ScheduleDay[];
  selectedDayDate: string | null;
  selectedDay: ScheduleDay | null;
  selectedItems: ScheduleItem[];
  currentWeekLabel: string;
  loading: boolean;
  refreshingWeek: boolean;
  error: string | null;
  noPersonalizedSchedule: boolean;
  currentDate: string;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  selectDay: (date: string) => void;
  toggleItemCompletion: (itemId: string) => Promise<void>;
  reload: () => Promise<void>;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfLocalWeek(date: Date): Date {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = normalized.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + offset);
  return normalized;
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + amount);
  return result;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (error && typeof error === "object") {
    const candidate =
      (error as { message?: unknown }).message ??
      (error as { error?: unknown }).error ??
      (error as { data?: { message?: unknown; error?: unknown } }).data?.message ??
      (error as { data?: { message?: unknown; error?: unknown } }).data?.error;

    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  if (error && typeof error === "object") {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }
  }

  return fallback;
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const status = (error as { status?: unknown }).status;
  if (typeof status === "number") {
    return status;
  }

  const responseStatus = (error as { response?: { status?: unknown } }).response?.status;
  if (typeof responseStatus === "number") {
    return responseStatus;
  }

  const dataStatus = (error as { data?: { status?: unknown } }).data?.status;
  if (typeof dataStatus === "number") {
    return dataStatus;
  }

  return undefined;
}

function getInitialWeekStart() {
  return formatLocalDate(startOfLocalWeek(new Date()));
}

function getWeekRangeLabel(weekStart: string, weekEnd: string): string {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  return `${formatter.format(parseLocalDate(weekStart))} - ${formatter.format(parseLocalDate(weekEnd))}`;
}

function resolveSelectedDate(week: ScheduleWeek, preferredDate: string | null) {
  const candidateDates = week.days.map((day) => day.date);
  if (preferredDate && candidateDates.includes(preferredDate)) {
    return preferredDate;
  }

  const today = formatLocalDate(new Date());
  if (candidateDates.includes(today)) {
    return today;
  }

  return week.days[0]?.date ?? null;
}

function updateWeekItems(week: ScheduleWeek, itemId: string, completed: boolean): ScheduleWeek {
  return {
    ...week,
    days: week.days.map((day) => ({
      ...day,
      items: day.items.map((item) => (item.id === itemId ? { ...item, completed } : item)),
    })),
  };
}

export function useSchedule(): UseScheduleResult {
  const currentDate = useMemo(() => formatLocalDate(new Date()), []);
  const [weekStart, setWeekStart] = useState(getInitialWeekStart);
  const [scheduleStartDate, setScheduleStartDate] = useState<string | null>(null);
  const [week, setWeek] = useState<ScheduleWeek | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingWeek, setRefreshingWeek] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noPersonalizedSchedule, setNoPersonalizedSchedule] = useState(false);
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

  const loadWeek = useCallback(
    async (targetWeekStart: string, preferredSelectedDate: string | null = null) => {
      setRefreshingWeek(true);
      setError(null);

      try {
        const response = await scheduleService.getWeek(targetWeekStart);
        setWeek(response);
        setWeekStart(targetWeekStart);
        setSelectedDayDate(resolveSelectedDate(response, preferredSelectedDate));
        setNoPersonalizedSchedule(false);
      } catch (caughtError) {
        const resolvedStatus = getErrorStatus(caughtError);

        if (resolvedStatus === 409 || resolvedStatus === 422) {
          setNoPersonalizedSchedule(true);
          setWeek(null);
          setSelectedDayDate(null);
          return;
        }

        setError(getErrorMessage(caughtError, "Erro ao carregar cronograma"));
      } finally {
        setLoading(false);
        setRefreshingWeek(false);
      }
    },
    []
  );

  const reload = useCallback(async () => {
    await loadWeek(weekStart, selectedDayDate);
  }, [loadWeek, selectedDayDate, weekStart]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      setError(null);
      setNoPersonalizedSchedule(false);

      try {
        const response = await scheduleService.create();
        if (!cancelled) {
          setScheduleStartDate(response.data.firstDate ?? null);
        }
      } catch (caughtError) {
        const resolvedStatus = getErrorStatus(caughtError);

        if (resolvedStatus === 409 || resolvedStatus === 422) {
          if (!cancelled) {
            setNoPersonalizedSchedule(true);
            setScheduleStartDate(null);
            setLoading(false);
          }
          return;
        }

        if (!cancelled) {
          setError(getErrorMessage(caughtError, "Erro ao carregar cronograma"));
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        await loadWeek(getInitialWeekStart(), currentDate);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [currentDate, loadWeek]);

  const selectedDay = useMemo(
    () => week?.days.find((day) => day.date === selectedDayDate) ?? null,
    [selectedDayDate, week]
  );

  const selectedItems = selectedDay?.items ?? [];
  const currentWeekLabel = week ? getWeekRangeLabel(week.weekStart, week.weekEnd) : "";

  const goToWeek = useCallback(
    (offsetDays: number) => {
      const nextWeekStart = formatLocalDate(addDays(parseLocalDate(weekStart), offsetDays));
      void loadWeek(nextWeekStart, nextWeekStart);
    },
    [loadWeek, weekStart]
  );

  const goToPreviousWeek = useCallback(() => {
    goToWeek(-7);
  }, [goToWeek]);

  const goToNextWeek = useCallback(() => {
    goToWeek(7);
  }, [goToWeek]);

  const selectDay = useCallback((date: string) => {
    setSelectedDayDate(date);
  }, []);

  const toggleItemCompletion = useCallback(
    async (itemId: string) => {
      if (!week || togglingItemId) {
        return;
      }

      const currentItem = week.days.flatMap((day) => day.items).find((item) => item.id === itemId);
      if (!currentItem) {
        return;
      }

      const nextCompleted = !currentItem.completed;
      const previousWeek = week;

      setTogglingItemId(itemId);
      setWeek(updateWeekItems(previousWeek, itemId, nextCompleted));

      try {
        await scheduleService.completeItem(itemId, nextCompleted);
      } catch (caughtError) {
        setWeek(previousWeek);
        setError(getErrorMessage(caughtError, "Erro ao carregar cronograma"));
      } finally {
        setTogglingItemId(null);
      }
    },
    [togglingItemId, week]
  );

  return {
    weekStart,
    weekEnd: week?.weekEnd ?? weekStart,
    scheduleStartDate,
    days: week?.days ?? [],
    selectedDayDate,
    selectedDay,
    selectedItems,
    currentWeekLabel,
    loading,
    refreshingWeek,
    error,
    noPersonalizedSchedule,
    currentDate,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
    toggleItemCompletion,
    reload,
  };
}
