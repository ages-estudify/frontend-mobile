import { useSchedule } from "@/hooks/useSchedule";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { ScheduleScreen } from "../schedule/ScheduleScreen";

jest.mock("@/hooks/useSchedule", () => ({
  useSchedule: jest.fn(),
}));

const mockedUseSchedule = jest.mocked(useSchedule);

describe("ScheduleScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra loading enquanto a semana é carregada", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [],
      selectedDay: null,
      selectedDayDate: null,
      selectedItems: [],
      currentWeekLabel: "",
      loading: true,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.UNSAFE_getByType("ActivityIndicator" as any)).toBeTruthy();
  });

  it("mostra loading enquanto a semana é atualizada", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [],
      selectedDay: null,
      selectedDayDate: null,
      selectedItems: [],
      currentWeekLabel: "",
      loading: false,
      refreshingWeek: true,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.UNSAFE_getByType("ActivityIndicator" as any)).toBeTruthy();
  });

  it("mostra o estado sem cronograma personalizado", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: null,
      days: [],
      selectedDay: null,
      selectedDayDate: null,
      selectedItems: [],
      currentWeekLabel: "",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: true,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Sem cronograma personalizado")).toBeTruthy();
    expect(screen.getByText("Semana 1")).toBeTruthy();
  });

  it("mostra o estado de erro quando nao ha dias", () => {
    const reload = jest.fn();

    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [],
      selectedDay: null,
      selectedDayDate: null,
      selectedItems: [],
      currentWeekLabel: "",
      loading: false,
      refreshingWeek: false,
      error: "Falha ao carregar",
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload,
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Erro ao carregar cronograma")).toBeTruthy();
    expect(screen.getByText("Falha ao carregar")).toBeTruthy();

    fireEvent.press(screen.getByText("Tentar novamente"));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("renderiza a semana, seleciona dias e marca itens", () => {
    const goToPreviousWeek = jest.fn();
    const goToNextWeek = jest.fn();
    const selectDay = jest.fn();
    const toggleItemCompletion = jest.fn();

    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [
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
          ],
        },
        {
          date: "2026-05-19",
          dayOfWeek: "TUESDAY",
          items: [],
        },
      ],
      selectedDay: {
        date: "2026-05-18",
        dayOfWeek: "MONDAY",
        items: [
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
        ],
      },
      selectedDayDate: "2026-05-18",
      selectedItems: [
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
      ],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek,
      goToNextWeek,
      selectDay,
      toggleItemCompletion,
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Segunda-feira - 18/05")).toBeTruthy();
    expect(screen.getByText("18:00")).toBeTruthy();
    expect(screen.getByText("Matemática")).toBeTruthy();
    expect(screen.getByText("Geometria Plana")).toBeTruthy();
    expect(screen.queryByText("Sem planos para hoje")).toBeNull();

    const mondayLabel = screen.getByText("Seg");
    const mondayPressable = mondayLabel.parent?.parent;
    expect(mondayPressable?.props.className).toContain("bg-secondaryGray");

    expect(screen.getByLabelText("Marcar Geometria Plana como concluído")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Semana anterior"));
    expect(goToPreviousWeek).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText("Semana seguinte"));
    expect(goToNextWeek).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText("Ter"));
    expect(selectDay).toHaveBeenCalledWith("2026-05-19");

    fireEvent.press(screen.getByLabelText("Marcar Geometria Plana como concluído"));
    expect(toggleItemCompletion).toHaveBeenCalledWith("item-1");
  });

  it("mostra o banner de erro quando ja existem dias", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [],
        },
      ],
      selectedDay: {
        date: "2026-05-18",
        dayOfWeek: "MONDAY",
        items: [],
      },
      selectedDayDate: "2026-05-18",
      selectedItems: [],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: "Aviso de erro",
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Aviso de erro")).toBeTruthy();
  });

  it("calcula a semana quando o cronograma inicia no domingo", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-17",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [],
        },
      ],
      selectedDay: {
        date: "2026-05-18",
        dayOfWeek: "MONDAY",
        items: [],
      },
      selectedDayDate: "2026-05-18",
      selectedItems: [],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Semana 2")).toBeTruthy();
  });

  it("mostra o estado sem data selecionada", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [],
        },
      ],
      selectedDay: null,
      selectedDayDate: null,
      selectedItems: [],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Sem data selecionada")).toBeTruthy();
  });

  it("renderiza item concluido e chama toggle", () => {
    const toggleItemCompletion = jest.fn();

    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [
            {
              id: "item-2",
              scheduledTime: "09:00",
              disciplineId: "discipline-2",
              disciplineName: "Geografia",
              disciplineIcon: "geo",
              topicId: "topic-2",
              topicName: "Geografia",
              completed: true,
            },
          ],
        },
      ],
      selectedDay: {
        date: "2026-05-18",
        dayOfWeek: "MONDAY",
        items: [
          {
            id: "item-2",
            scheduledTime: "09:00",
            disciplineId: "discipline-2",
            disciplineName: "Geografia",
            disciplineIcon: "geo",
            topicId: "topic-2",
            topicName: "Geografia",
            completed: true,
          },
        ],
      },
      selectedDayDate: "2026-05-18",
      selectedItems: [
        {
          id: "item-2",
          scheduledTime: "09:00",
          disciplineId: "discipline-2",
          disciplineName: "Geografia",
          disciplineIcon: "geo",
          topicId: "topic-2",
          topicName: "Geografia",
          completed: true,
        },
      ],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion,
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    const checkbox = screen.getByLabelText("Marcar Geografia como concluído");
    expect(checkbox.props.accessibilityState).toEqual({ checked: true });

    fireEvent.press(checkbox);
    expect(toggleItemCompletion).toHaveBeenCalledWith("item-2");
  });

  it("mostra estado de dia vazio quando selectedItems esta vazio", () => {
    mockedUseSchedule.mockReturnValue({
      weekStart: "2026-05-18",
      scheduleStartDate: "2026-05-12",
      days: [
        {
          date: "2026-05-18",
          dayOfWeek: "MONDAY",
          items: [],
        },
      ],
      selectedDay: {
        date: "2026-05-18",
        dayOfWeek: "MONDAY",
        items: [],
      },
      selectedDayDate: "2026-05-18",
      selectedItems: [],
      currentWeekLabel: "18 mai. - 24 mai.",
      loading: false,
      refreshingWeek: false,
      error: null,
      noPersonalizedSchedule: false,
      currentDate: "2026-05-18",
      goToPreviousWeek: jest.fn(),
      goToNextWeek: jest.fn(),
      selectDay: jest.fn(),
      toggleItemCompletion: jest.fn(),
      reload: jest.fn(),
    });

    render(<ScheduleScreen />);

    expect(screen.getByText("Sem planos para hoje")).toBeTruthy();
  });
});
