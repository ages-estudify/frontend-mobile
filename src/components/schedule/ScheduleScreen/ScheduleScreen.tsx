import { useSchedule } from "@/hooks/useSchedule";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Clock3 } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Qua",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sab",
  SUNDAY: "Dom",
};

const WEEKDAY_FULL_LABELS: Record<string, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

function getScheduleWeekNumber(weekStart: string, scheduleStartDate: string | null) {
  if (!scheduleStartDate) {
    return 1;
  }

  const scheduleStart = new Date(`${scheduleStartDate}T12:00:00`);
  const scheduleDay = scheduleStart.getDay();
  const scheduleOffset = scheduleDay === 0 ? -6 : 1 - scheduleDay;
  scheduleStart.setDate(scheduleStart.getDate() + scheduleOffset);

  const currentWeekStart = new Date(`${weekStart}T12:00:00`);
  const diffDays = Math.floor((currentWeekStart.getTime() - scheduleStart.getTime()) / 86400000);
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

function ScheduleItemRow({
  item,
  onToggle,
}: {
  item: {
    id: string;
    scheduledTime: string;
    disciplineName: string;
    topicName: string;
    completed: boolean;
  };
  onToggle: (itemId: string) => void;
}) {
  const TAG_COLORS: Record<string, string> = {
    Geografia: "bg-amber-100 text-amber-800",
    História: "bg-yellow-100 text-yellow-800",
    Espanhol: "bg-pink-100 text-pink-800",
    Inglês: "bg-sky-100 text-sky-700",
  };

  const tagClass = TAG_COLORS[item.topicName] || "bg-slate-100 text-slate-700";

  return (
    <View
      className={`${item.completed ? "flex-row items-center justify-between rounded-[8px] border border-l-4 border-secondaryGray bg-white px-4 py-4" : "flex-row items-center justify-between rounded-[8px] border border-l-4 border-borderGreen bg-white px-4 py-4"}`}
    >
      <View className="flex-row items-start gap-3">
        <View className="items-center gap-2">
          <View className="flex-col items-center gap-1 py-1">
            <Clock3 size={17} color={`${item.completed ? "#94a3b8" : "#4b5563"}`} />
            <Text className={`text-[11px] ${item.completed ? "text-slate-400" : "text-slate-700"}`}>
              {item.scheduledTime}
            </Text>
          </View>
        </View>
        <View>
          <Text
            className={`font-poppins-semi text-[16px] ${item.completed ? "text-slate-400" : "text-slate-950"}`}
          >
            {item.topicName}
          </Text>

          <View className="mt-1">
            <View className={`self-start rounded-[3.8px] px-2 py-1 ${tagClass}`}>
              <Text
                className={`text-[12px] font-semibold ${item.completed ? "text-slate-400" : ""}`}
              >
                {item.disciplineName}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.completed }}
          accessibilityLabel={`Marcar ${item.topicName} como concluído`}
          onPress={() => onToggle(item.id)}
          className="h-[21px] w-[18px] rounded-full border-slate-200 bg-white"
        >
          {item.completed ? (
            <CheckCircle2 size={17} color="#15803d" />
          ) : (
            <Circle size={17} color="#94a3b8" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function ScheduleScreen() {
  const {
    days,
    weekStart,
    scheduleStartDate,
    selectedDay,
    selectedDayDate,
    selectedItems,
    currentWeekLabel,
    loading,
    refreshingWeek,
    error,
    noPersonalizedSchedule,
    goToPreviousWeek,
    goToNextWeek,
    selectDay,
    toggleItemCompletion,
    reload,
  } = useSchedule();

  if (loading || refreshingWeek) {
    return (
      <View className="min-h-[320px] flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  console.log(error);
  if (error && days.length === 0 && error !== "Defina ao menos uma janela de estudo") {
    return (
      <View className="flex-1 px-4 pt-4">
        <View className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6">
          <Text className="font-poppins-semi text-[22px] text-rose-900">
            Erro ao carregar cronograma
          </Text>
          <Text className="mt-2 text-[15px] leading-6 text-rose-800">{error}</Text>
          <Pressable
            onPress={reload}
            className="mt-5 self-start rounded-full bg-rose-900 px-4 py-2"
          >
            <Text className="text-[13px] font-semibold text-white">Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const selectedDayLabel = selectedDay
    ? WEEKDAY_FULL_LABELS[selectedDay.dayOfWeek]
    : "Selecione um dia";

  return (
    <View className="flex-1 px-4 pt-4">
      {error && days.length > 0 && (
        <View className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-[13px] font-semibold text-rose-900">{error}</Text>
        </View>
      )}
      {scheduleStartDate && (
        <View className="mb-4 rounded-[8px] bg-white py-2">
          <View className="h-[49px] flex-row items-center justify-between gap-3">
            <Pressable
              onPress={goToPreviousWeek}
              accessibilityLabel="Semana anterior"
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <ChevronLeft size={22} color="#0f172a" />
            </Pressable>

            <View className="h-[35px] w-[85px] flex-1 items-center">
              <Text className="font-sf-pro text-[16px] font-semibold text-greenPrimary">
                Semana {getScheduleWeekNumber(weekStart, scheduleStartDate)}
              </Text>
              <Text className="mt-1 font-poppins text-[13px] text-primaryGray">
                {currentWeekLabel}
              </Text>
            </View>

            <Pressable
              onPress={goToNextWeek}
              accessibilityLabel="Semana seguinte"
              className="h-11 w-11 items-center justify-center rounded-full bg-white"
            >
              <ChevronRight size={22} color="#0f172a" />
            </Pressable>
          </View>
        </View>
      )}

      {scheduleStartDate && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-10 max-h-[60px]"
          contentContainerClassName="w-full"
        >
          <View className="flex-1 flex-row justify-between gap-2 rounded-[8px] bg-white px-2 py-2">
            {days.map((day) => {
              const isSelected = day.date === selectedDayDate;

              return (
                <Pressable
                  key={day.date}
                  onPress={() => selectDay(day.date)}
                  className={`max-h-[47px] flex-1 rounded-[8px] px-1 py-2 ${isSelected ? "bg-secondaryGray" : "border-transparent bg-white"}`}
                >
                  <Text className={`text-slate-greenPrimary text-center text-[12px] font-semibold`}>
                    {DAY_LABELS[day.dayOfWeek]}
                  </Text>
                  <Text className={`mt-1 text-center font-poppins-semi text-[10px]`}>
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    }).format(new Date(`${day.date}T12:00:00`))}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {scheduleStartDate && (
        <View className="mb-3">
          <Text className="font-poppins-semi text-[20px] text-slate-950">
            {selectedDay
              ? `${selectedDayLabel} - ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(`${selectedDay.date}T12:00:00`))}`
              : "Sem data selecionada"}
          </Text>
        </View>
      )}

      {!scheduleStartDate && (
        <View className="flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10">
          <Image source={require("../../../../assets/calendar_fox.png")} className="h-32 w-32" />
          <Text className="text-center font-poppins-semi text-[16px] text-slate-950">
            Você ainda não tem um cronograma personalizado!
          </Text>
          <Text className="mt-2 text-center text-[13px] leading-6 text-slate-600">
            Acesse seu perfil e nos conte suas preferências de dias e horários.
          </Text>
        </View>
      )}

      {scheduleStartDate && selectedItems.length === 0 ? (
        <View className="flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
          <Image source={require("../../../../assets/chill_fox.png")} className="h-32 w-32" />
          <Text className="font-poppins-semi text-[16px] text-slate-950">Sem planos para hoje</Text>
          <Text className="mt-2 text-center text-[13px] leading-6 text-slate-600">
            Aproveite para descansar!
          </Text>
        </View>
      ) : (
        <View className="gap-3 pb-6">
          {selectedItems.map((item) => (
            <ScheduleItemRow key={item.id} item={item} onToggle={toggleItemCompletion} />
          ))}
        </View>
      )}
    </View>
  );
}

export default ScheduleScreen;
