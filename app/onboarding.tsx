import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onboardingService } from "@/services/onboarding.service";
import type { OnboardingRequest, StudyDay, StudyHoursMap } from "@/types/onboarding.types";

const ONBOARDING_COMPLETED_STORAGE_KEY = "hasCompletedOnboarding";

type OnboardingStep = 0 | 1 | 2;

type DayOption = {
  label: string;
  value: StudyDay;
};

const STUDY_DAY_OPTIONS: DayOption[] = [
  { label: "Seg", value: "MONDAY" },
  { label: "Ter", value: "TUESDAY" },
  { label: "Qua", value: "WEDNESDAY" },
  { label: "Qui", value: "THURSDAY" },
  { label: "Sex", value: "FRIDAY" },
  { label: "Sab", value: "SATURDAY" },
  { label: "Dom", value: "SUNDAY" },
];

const STUDY_HOURS: number[] = [
  5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];

function formatStudyHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function sortHours(hours: number[]): number[] {
  return [...hours].sort((hourA, hourB) => hourA - hourB);
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();

  const [step, setStep] = useState<OnboardingStep>(0);
  const [desiredCourse, setdesiredCourse] = useState("");
  const [preferredLanguage, setpreferredLanguage] = useState("");
  const [desiredUniversity, setdesiredUniversity] = useState("");
  const [selectedDays, setSelectedDays] = useState<StudyDay[]>([]);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  React.useEffect(() => {
    const checkOnboardingStatus = async () => {
      const isCompleted = await AsyncStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY);
      if (isCompleted === "true") {
        router.replace("/(tabs)/treinar");
      }
    };

    checkOnboardingStatus();
  }, [router]);

  const primaryButtonLabel = step < 2 ? "Proximo" : isSubmitting ? "Salvando" : "Salvar";

  function toggleDay(day: StudyDay) {
    setSelectedDays((previousDays) =>
      previousDays.includes(day)
        ? previousDays.filter((currentDay) => currentDay !== day)
        : [...previousDays, day]
    );
  }

  function toggleStudyHour(hour: number) {
    setSelectedHours((previousHours) =>
      previousHours.includes(hour)
        ? previousHours.filter((currentHour) => currentHour !== hour)
        : sortHours([...previousHours, hour])
    );
  }

  function normalizePreferredLanguage(input: string): "ENGLISH" | "SPANISH" | null {
    if (!input) return null;
    const normalized = input.trim().toLowerCase();
    if (/(en|ingl)/.test(normalized)) return "ENGLISH";
    if (/(es|espanh|espan)/.test(normalized)) return "SPANISH";
    if (normalized === "english") return "ENGLISH";
    if (normalized === "spanish") return "SPANISH";
    return null;
  }

  function buildPayload(options: { includeStudyHours: boolean }) {
    const { includeStudyHours } = options;

    const payload: Partial<OnboardingRequest> = {};

    const course = desiredCourse.trim();
    const uni = desiredUniversity.trim();
    const prefLangRaw = preferredLanguage.trim();
    const prefLang = normalizePreferredLanguage(prefLangRaw);

    if (course) payload.desiredCourse = course;
    if (uni) payload.desiredUniversity = uni;
    if (prefLang) payload.preferredLanguage = prefLang;

    if (includeStudyHours && selectedDays.length > 0 && selectedHours.length > 0) {
      const sortedHours = sortHours(selectedHours);
      const studyHoursPayload: StudyHoursMap = {};

      selectedDays.forEach((day) => {
        studyHoursPayload[day] = sortedHours;
      });

      payload.studyHours = studyHoursPayload;
    }

    return payload;
  }

  async function submitWithPayload(payload: Partial<OnboardingRequest>) {
    if (isSubmittingRef.current) return;

    const pref = payload.preferredLanguage as string | undefined;
    if (pref && pref !== "ENGLISH" && pref !== "SPANISH") {
      Alert.alert("Erro", "preferredLanguage deve ser ENGLISH ou SPANISH");
      return;
    }
    console.log("Payload a ser submetido:", payload);

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      await onboardingService.submit(payload as OnboardingRequest);
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, "true");
      router.replace("/(tabs)/treinar");
    } catch (error) {
      Alert.alert("Erro", error as string);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    if (isSubmitting) {
      return;
    }

    if (step === 0) {
      void submitWithPayload({});
      return;
    }

    if (step === 1) {
      setdesiredCourse("");
      setpreferredLanguage("");
      setdesiredUniversity("");
      setStep(2);
      return;
    }

    const payload = buildPayload({ includeStudyHours: false });
    void submitWithPayload(payload);
  }

  async function handleSubmitOnboarding() {
    if (isSubmittingRef.current) {
      return;
    }

    const payload = buildPayload({ includeStudyHours: true });

    await submitWithPayload(payload);
  }

  function handlePrimaryAction() {
    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    handleSubmitOnboarding();
  }
  return (
    <SafeAreaView className="flex-1 bg-purple100">
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
        className="flex-1"
      >
        <View className="relative mt-auto h-[45%] rounded-t-[28px] bg-whitebg px-6 pt-8">
          {step === 0 && (
            <View className="absolute right-6" style={{ top: -screenHeight * 0.22 }}>
              <Image
                source={require("../assets/waving_fox.png")}
                className="h-[190px] w-[210px]"
                resizeMode="contain"
              />
            </View>
          )}

          {step === 1 && (
            <View className="absolute left-8" style={{ top: -screenHeight * 0.2 }}>
              <Image
                source={require("../assets/on_target_fox-1.png")}
                className="h-[176px] w-[342px]"
                resizeMode="contain"
              />
            </View>
          )}

          {step === 2 && (
            <View className="absolute left-1" style={{ top: -screenHeight * 0.16 }}>
              <Image
                source={require("../assets/fox_watch.png")}
                className="h-[146px] w-[186px]"
                resizeMode="contain"
              />
            </View>
          )}

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {step === 0 && (
              <View>
                <Text className="mb-6 text-center font-poppins-semi text-[32px] leading-[48px] text-black">
                  Ola, eu sou o Estu!
                </Text>
                <Text className="mb-6 text-center font-inter text-[16px] leading-7 text-black">
                  Vou estar ao seu lado em toda essa jornada de estudos. Antes de comecar, quero
                  saber um pouco mais sobre voce para montar um cronograma perfeito para a sua
                  aprovacao!
                </Text>
              </View>
            )}

            {step === 1 && (
              <View>
                <Text className="mb-8 text-center font-poppins-semi text-[36px] leading-[46px] text-black">
                  Me conte suas metas e objetivos
                </Text>

                <View className="mb-4 gap-2">
                  <Text className="font-inter-medium text-[16px] text-primaryGray">
                    Curso desejado
                  </Text>
                  <TextInput
                    testID="onboarding-desired-course-input"
                    value={desiredCourse}
                    onChangeText={setdesiredCourse}
                    placeholder="Ex: Computação"
                    className="rounded-xl bg-white px-4 py-3 font-inter text-base text-black"
                    autoCapitalize="words"
                  />
                </View>

                <View className="mb-4 gap-2">
                  <Text className="font-inter-medium text-[16px] text-primaryGray">
                    Língua estrangeira preferida
                  </Text>
                  <TextInput
                    testID="onboarding-preferred-language-input"
                    value={preferredLanguage}
                    onChangeText={setpreferredLanguage}
                    placeholder="Ex: Inglês"
                    className="rounded-xl bg-white px-4 py-3 font-inter text-base text-black"
                    autoCapitalize="words"
                  />
                </View>

                <View className="gap-2">
                  <Text className="font-inter-medium text-[16px] text-primaryGray">
                    Universidade desejada
                  </Text>
                  <TextInput
                    testID="onboarding-desired-university-input"
                    value={desiredUniversity}
                    onChangeText={setdesiredUniversity}
                    placeholder="Ex: PUCRS"
                    className="rounded-xl bg-white px-4 py-3 font-inter text-base text-black"
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text className="mb-6 text-center font-poppins-semi text-[30px] leading-[44px] text-black">
                  Vamos organizar seus horários de estudo
                </Text>

                <View className="mb-8 gap-3">
                  <Text className="font-inter-medium text-base text-primaryGray">
                    Dias de Estudo
                  </Text>
                  <View className="flex-row flex-wrap justify-between gap-3.5">
                    {STUDY_DAY_OPTIONS.map((dayOption) => {
                      const isSelected = selectedDays.includes(dayOption.value);

                      return (
                        <Pressable
                          key={dayOption.value}
                          testID={`onboarding-day-${dayOption.value}`}
                          onPress={() => toggleDay(dayOption.value)}
                          className={`w-[30%] shrink-0 items-center rounded-[8px] border px-2 py-2 ${
                            isSelected
                              ? "border-purple100 bg-purple100"
                              : "border-secondaryGray bg-white"
                          }`}
                        >
                          <Text
                            className={`font-inter-semi text-sm ${
                              isSelected ? "text-white" : "text-primaryGray"
                            }`}
                          >
                            {dayOption.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="gap-3">
                  <Text className="font-inter-medium text-base text-primaryGray">
                    Horarios de Preferencia
                  </Text>
                  <Text className="font-inter text-xs text-primaryGray">
                    Toque nos horarios para selecionar ou remover
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {STUDY_HOURS.map((hour) => {
                      const hourLabel = formatStudyHourLabel(hour);
                      const isSelected = selectedHours.includes(hour);

                      return (
                        <Pressable
                          key={hour}
                          testID={`onboarding-hour-${hourLabel}`}
                          onPress={() => toggleStudyHour(hour)}
                          className={`h-[32px] w-[23%] shrink-0 items-center justify-center rounded-[8px] border px-1 ${
                            isSelected
                              ? "border-purple100 bg-[#C79AE8]"
                              : "border-secondaryGray bg-white"
                          }`}
                        >
                          <Text
                            className={`font-inter-medium text-[13px] ${
                              isSelected ? "text-purple100" : "text-primaryGray"
                            }`}
                          >
                            {hourLabel}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View className="flex-row items-center justify-between pb-6 pt-3">
            <Pressable
              testID="onboarding-skip-button"
              onPress={handleSkip}
              disabled={isSubmitting}
              className={`${isSubmitting ? "opacity-50" : "opacity-100"}`}
            >
              <Text className="font-inter-semi text-[20px] text-black">→ Pular</Text>
            </Pressable>

            <Pressable
              testID="onboarding-primary-button"
              onPress={handlePrimaryAction}
              disabled={isSubmitting}
              className={`h-12 min-w-[130px] items-center justify-center rounded-full px-7 ${
                isSubmitting ? "bg-black/70" : "bg-black"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="font-poppins text-[20px] text-white">{primaryButtonLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
