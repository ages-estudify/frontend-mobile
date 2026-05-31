import { scheduleService } from "@/services/schedule.service";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { formatLocalDate, useSchedule } from "../useSchedule";

jest.mock("@/services/schedule.service", () => ({
  scheduleService: {
    create: jest.fn(),
    getWeek: jest.fn(),
    completeItem: jest.fn(),
  },
}));

const mockedScheduleService = jest.mocked(scheduleService);

const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

function addDays(dateString: string, amount: number) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return formatLocalDate(date);
}

function makeWeek(weekStart: string) {
  return {
    weekStart,
    weekEnd: addDays(weekStart, 6),
    days: DAY_ORDER.map((dayOfWeek, index) => {
      const date = addDays(weekStart, index);
      return {
        date,
        dayOfWeek,
        items:
          index === 0
            ? [
                {
                  id: "item-1",
                  scheduledTime: "18:00",
                  disciplineId: "discipline-1",
                  disciplineName: "Matemática",
                  disciplineIcon: "math",
                  topicId: "topic-1",
                  topicName: "Geometria Plana",
                  completed: false,
                },
              ]
            : [],
      };
    }),
  };
}

function makeWeekWithDates(weekStart: string, dates: string[]) {
  return {
    weekStart,
    weekEnd: dates[dates.length - 1] ?? weekStart,
    days: dates.map((date, index) => ({
      date,
      dayOfWeek: DAY_ORDER[index % DAY_ORDER.length],
      items: [],
    })),
  };
}

describe("useSchedule", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-18T12:00:00"));
    jest.clearAllMocks();

    mockedScheduleService.create.mockResolvedValue({
      data: {
        generatedItems: 60,
        firstDate: "2026-05-12",
        lastDate: "2026-08-04",
      },
    });

    mockedScheduleService.getWeek.mockImplementation(async (weekStart: string) =>
      makeWeek(weekStart)
    );
    mockedScheduleService.completeItem.mockResolvedValue({
      data: {
        itemId: "item-1",
        completed: true,
      },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("faz bootstrap, carrega a semana atual e seleciona o dia corrente", async () => {
    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedScheduleService.create).toHaveBeenCalledTimes(1);
    expect(mockedScheduleService.getWeek).toHaveBeenCalledWith("2026-05-18");
    expect(result.current.scheduleStartDate).toBe("2026-05-12");
    expect(result.current.selectedDayDate).toBe("2026-05-18");
    expect(result.current.selectedItems).toHaveLength(1);
    expect(result.current.selectedItems[0].topicName).toBe("Geometria Plana");
    expect(result.current.currentWeekLabel).toContain("18");
  });

  it("exibe a tela sem cronograma quando o POST retorna 409", async () => {
    mockedScheduleService.create.mockRejectedValueOnce({ response: { status: 409 } });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.noPersonalizedSchedule).toBe(true);
    expect(mockedScheduleService.getWeek).not.toHaveBeenCalled();
  });

  it("exibe a tela sem cronograma quando o POST retorna 422", async () => {
    mockedScheduleService.create.mockRejectedValueOnce({ response: { status: 422 } });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.noPersonalizedSchedule).toBe(true);
    expect(mockedScheduleService.getWeek).not.toHaveBeenCalled();
  });

  it.each([400, 401, 403, 404, 500])("trata erro %s no POST /schedule", async (status) => {
    mockedScheduleService.create.mockRejectedValueOnce({
      response: { status },
      message: `Falha ${status}`,
    });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(`Falha ${status}`);
    expect(result.current.noPersonalizedSchedule).toBe(false);
    expect(mockedScheduleService.getWeek).not.toHaveBeenCalled();
  });

  it("navega entre semanas e refaz o GET com uma segunda-feira", async () => {
    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.goToNextWeek();
    });

    await waitFor(() => {
      expect(mockedScheduleService.getWeek).toHaveBeenLastCalledWith("2026-05-25");
    });

    expect(result.current.selectedDayDate).toBe("2026-05-25");
  });

  it("navega para a semana anterior enviando a segunda-feira", async () => {
    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.goToPreviousWeek();
    });

    await waitFor(() => {
      expect(mockedScheduleService.getWeek).toHaveBeenLastCalledWith("2026-05-11");
    });
  });

  it.each([400, 401, 403, 404, 500])("trata erro %s no GET /schedule", async (status) => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({
      response: { status },
      message: `Erro ${status}`,
    });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(`Erro ${status}`);
    expect(result.current.noPersonalizedSchedule).toBe(false);
  });

  it("resolve mensagem de erro como string no GET /schedule", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce("Falha direta");

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Falha direta");
  });

  it("resolve mensagem de erro a partir de data string no GET /schedule", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({ data: "Falha em data" });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Falha em data");
  });

  it("usa fallback quando erro nao possui mensagem", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({});

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Erro ao carregar cronograma");
  });

  it.each([409, 422])("trata %s no GET /schedule como sem cronograma", async (status) => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({ response: { status } });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.noPersonalizedSchedule).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.selectedDayDate).toBeNull();
  });

  it("le status direto no erro para GET /schedule", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({ status: 500 });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Erro ao carregar cronograma");
  });

  it("le status a partir de data no erro para GET /schedule", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({ data: { status: 500 } });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Erro ao carregar cronograma");
  });

  it("mantem selecionado o primeiro dia quando preferencia nao pertence a semana", async () => {
    mockedScheduleService.getWeek.mockResolvedValueOnce(
      makeWeekWithDates("2026-05-25", ["2026-05-25", "2026-05-26"])
    );

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.selectDay("2026-05-19");
    });

    mockedScheduleService.getWeek.mockResolvedValueOnce(
      makeWeekWithDates("2026-05-25", ["2026-05-25", "2026-05-26"])
    );

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.selectedDayDate).toBe("2026-05-25");
  });

  it("retorna sem fazer toggle quando nao ha semana", async () => {
    mockedScheduleService.getWeek.mockRejectedValueOnce({ response: { status: 409 } });

    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleItemCompletion("item-1");
    });

    expect(mockedScheduleService.completeItem).not.toHaveBeenCalled();
  });

  it("retorna sem fazer toggle quando item nao existe", async () => {
    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleItemCompletion("item-404");
    });

    expect(mockedScheduleService.completeItem).not.toHaveBeenCalled();
  });

  it("faz optimistic update ao marcar item e reverte em caso de erro", async () => {
    const { result } = renderHook(() => useSchedule());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleItemCompletion("item-1");
    });

    expect(mockedScheduleService.completeItem).toHaveBeenCalledWith("item-1", true);
    expect(result.current.selectedItems[0].completed).toBe(true);

    mockedScheduleService.completeItem.mockRejectedValueOnce({ message: "Falha ao salvar" });

    await act(async () => {
      await result.current.toggleItemCompletion("item-1");
    });

    expect(result.current.selectedItems[0].completed).toBe(true);
    expect(result.current.error).toBe("Falha ao salvar");
  });
});
