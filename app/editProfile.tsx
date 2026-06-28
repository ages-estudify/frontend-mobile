import { ProfileFormField } from "@/components/Profile/ProfileFormField";
import { ProfilePictureEditor } from "@/components/ProfilePictureEditor/Profilepictureeditor";
import { useAuthSession } from "@/contexts/AuthContext";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { userPreferencesService } from "@/services/userPreferences/userPreferences.service";
import { saveUserProfile } from "@/services/userProfile/userProfile.storage";
import type { StudyDay, StudyHoursMap } from "@/types/onboarding.types";
import type { UpdateUserPreferencesRequest } from "@/types/userPreferences.types";
import {
  STUDY_DAY_LABELS,
  formatPreferredLanguage,
  formatStudyHourLabel,
  normalizePreferredLanguage,
  sortStudyHours,
} from "@/utils/studySchedule";
import { hasGatedContentAccess } from "@/utils/subscription-access";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STUDY_DAYS: StudyDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const STUDY_HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

function formatPlanStatus(status?: string): string {
  if (status === "active") return "Ativo";
  if (status === "inactive") return "Inativo";
  return status ?? "—";
}

function getSaveErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return "Algo deu errado. Tente novamente.";
}

function buildPayload(
  fullName: string,
  desiredCourse: string,
  desiredUniversity: string,
  preferredLanguage: string,
  studyHoursByDay: StudyHoursMap
): UpdateUserPreferencesRequest {
  const payload: UpdateUserPreferencesRequest = {};

  const name = fullName.trim();
  const course = desiredCourse.trim();
  const university = desiredUniversity.trim();
  const prefLang = normalizePreferredLanguage(preferredLanguage.trim());

  if (name) payload.name = name;
  if (course) payload.desiredCourse = course;
  if (university) payload.desiredUniversity = university;
  if (prefLang) payload.preferredLanguage = prefLang;

  const studyHours: StudyHoursMap = {};
  (Object.entries(studyHoursByDay) as [StudyDay, number[]][]).forEach(([day, hours]) => {
    if (hours && hours.length > 0) {
      studyHours[day] = sortStudyHours(hours);
    }
  });
  if (Object.keys(studyHours).length > 0) {
    payload.studyHours = studyHours;
  }

  return payload;
}

function buildProfileUpdate(payload: UpdateUserPreferencesRequest) {
  const update: Parameters<typeof saveUserProfile>[0] = {};

  if (payload.name) update.fullName = payload.name;
  if (payload.desiredCourse) update.desiredCourse = payload.desiredCourse;
  if (payload.desiredUniversity) update.desiredUniversity = payload.desiredUniversity;
  if (payload.preferredLanguage) update.preferredLanguage = payload.preferredLanguage;
  if (payload.studyHours) update.studyHours = payload.studyHours;

  return update;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, loading, error, reload } = useUserProfile();
  const { role, planExpirationDate } = useAuthSession();
  const { profilePictureUrl, updateProfilePicture } = useUserProfileContext();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [desiredCourse, setDesiredCourse] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [desiredUniversity, setDesiredUniversity] = useState("");
  const [studyHoursByDay, setStudyHoursByDay] = useState<StudyHoursMap>({});
  const [activeDays, setActiveDays] = useState<StudyDay[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const activeHours = activeDays.length > 0 ? (studyHoursByDay[activeDays[0]] ?? []) : [];

  const hasInitializedForm = useRef(false);
  const isSavingRef = useRef(false);

  const planStatus = profile?.planStatus
    ? formatPlanStatus(profile.planStatus)
    : hasGatedContentAccess(role, planExpirationDate)
      ? "Ativo"
      : "Inativo";

  useEffect(() => {
    if (!profile || hasInitializedForm.current) return;

    setFullName(profile.fullName?.trim() ?? "");
    setEmail(profile.email?.trim() ?? "");
    setDesiredCourse(profile.desiredCourse?.trim() ?? "");
    setPreferredLanguage(
      profile.preferredLanguage ? formatPreferredLanguage(profile.preferredLanguage) : ""
    );
    setDesiredUniversity(profile.desiredUniversity?.trim() ?? "");
    if (profile.studyHours) {
      setStudyHoursByDay(profile.studyHours);
      setActiveDays(
        (Object.keys(profile.studyHours) as StudyDay[]).filter(
          (day) => (profile.studyHours?.[day]?.length ?? 0) > 0
        )
      );
    }

    hasInitializedForm.current = true;
  }, [profile]);

  function toggleDay(day: StudyDay) {
    const isActive = activeDays.includes(day);
    const isSelected = day in studyHoursByDay;

    if (isActive) {
      setActiveDays((prev) => prev.filter((currentDay) => currentDay !== day));
      setStudyHoursByDay((prev) => {
        const next = { ...prev };
        delete next[day];
        return next;
      });
      return;
    }

    if (isSelected) {
      setStudyHoursByDay((prev) => {
        const next = { ...prev };
        delete next[day];
        return next;
      });
      return;
    }

    if (activeHours.length > 0) {
      setActiveDays([day]);
      setStudyHoursByDay((prev) => ({ ...prev, [day]: [] }));
    } else {
      setActiveDays((prev) => [...prev, day]);
      setStudyHoursByDay((prev) => ({ ...prev, [day]: [] }));
    }
  }

  function toggleHour(hour: number) {
    if (activeDays.length === 0) return;

    setStudyHoursByDay((prev) => {
      const currentHours = prev[activeDays[0]] ?? [];
      const alreadySelected = currentHours.includes(hour);
      const updatedHours = alreadySelected
        ? currentHours.filter((currentHour) => currentHour !== hour)
        : sortStudyHours([...currentHours, hour]);

      const next = { ...prev };
      activeDays.forEach((currentDay) => {
        next[currentDay] = updatedHours;
      });
      return next;
    });
  }

  async function handleSave() {
    if (isSavingRef.current) return;

    const languageInput = preferredLanguage.trim();
    const prefLang = normalizePreferredLanguage(languageInput);

    if (languageInput && !prefLang) {
      Alert.alert("Erro", "A língua estrangeira deve ser Inglês ou Espanhol.");
      return;
    }

    try {
      isSavingRef.current = true;
      setIsSaving(true);

      const payload = buildPayload(
        fullName,
        desiredCourse,
        desiredUniversity,
        preferredLanguage,
        studyHoursByDay
      );

      await userPreferencesService.update(payload);
      await saveUserProfile(buildProfileUpdate(payload));
      await reload();
      router.replace("/(tabs)/cronograma");
    } catch (error) {
      Alert.alert("Erro", getSaveErrorMessage(error));
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  if (loading && !profile) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-whitebg"
        edges={["top", "left", "right"]}
      >
        <ActivityIndicator size="large" color="#3E2B5C" />
        <Text className="mt-3 font-inter text-[15px] text-primaryGray">Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="px-[16px]">
        <View className="mb-[24px] flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="h-[40px] w-[40px] items-center justify-center rounded-full bg-white"
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={20} color="#000000" />
          </Pressable>

          <Pressable
            onPress={() => void handleSave()}
            disabled={isSaving}
            className={`h-[40px] w-[40px] items-center justify-center rounded-full bg-purple100 ${
              isSaving ? "opacity-70" : "opacity-100"
            }`}
            accessibilityRole="button"
            accessibilityLabel="Salvar"
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="checkmark" size={22} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          {error ? (
            <View className="mb-[16px] rounded-[12px] border border-cardBorder bg-white px-[16px] py-[12px]">
              <Text className="font-inter text-[14px] text-primaryGray">{error}</Text>
              <Pressable onPress={() => void reload()} className="mt-2">
                <Text className="font-inter-semi text-[14px] text-purple100">Tentar novamente</Text>
              </Pressable>
            </View>
          ) : null}

          <View className="mb-[28px] items-center">
            <ProfilePictureEditor
              currentUrl={profilePictureUrl}
              onUpdate={(url) => void updateProfilePicture(url)}
              onRemove={() => void updateProfilePicture(null)}
            />
          </View>

          <View className="gap-[32px]">
            <ProfileFormField label="Nome" value={fullName} onChangeText={setFullName} />
            <ProfileFormField label="E-mail" value={email} editable={false} />
            <ProfileFormField label="Situação do Plano" value={planStatus} variant="text" />
            <ProfileFormField
              label="Curso Desejado"
              value={desiredCourse}
              onChangeText={setDesiredCourse}
            />
            <ProfileFormField
              label="Língua Estrangeira de Preferência"
              value={preferredLanguage}
              onChangeText={setPreferredLanguage}
            />
            <ProfileFormField
              label="Universidade Desejada"
              value={desiredUniversity}
              onChangeText={setDesiredUniversity}
            />
          </View>

          <View className="mt-[28px] gap-[24px]">
            <View className="gap-[10px]">
              <Text className="font-inter-medium text-[14px] text-primaryGray">Dias de Estudo</Text>

              <View className="flex-row flex-wrap justify-between gap-[8px]">
                {STUDY_DAYS.map((day) => {
                  const isActive = activeDays.includes(day);
                  const isSelected = day in studyHoursByDay;

                  return (
                    <Pressable
                      key={day}
                      onPress={() => toggleDay(day)}
                      className={`w-[30%] shrink-0 items-center rounded-[10px] border px-2 py-[10px] ${
                        isActive
                          ? "border-greenSecondary bg-greenSecondary"
                          : isSelected
                            ? "border-greenSecondary bg-[#E6F4EA]"
                            : "border-secondaryGray bg-white"
                      }`}
                    >
                      <Text
                        className={`font-inter-semi text-[13px] ${
                          isActive ? "text-black" : "text-primaryGray"
                        }`}
                      >
                        {STUDY_DAY_LABELS[day]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-[10px]">
              <View className="gap-[2px]">
                <Text className="font-inter-medium text-[14px] text-primaryGray">
                  Horários de Estudo
                </Text>
                <Text className="font-inter text-[12px] text-primaryGray">
                  Toque nos horários para selecionar ou remover
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-[8px]">
                {STUDY_HOURS.map((hour) => {
                  const isSelected = activeHours.includes(hour);

                  return (
                    <Pressable
                      key={hour}
                      onPress={() => toggleHour(hour)}
                      className={`h-[36px] w-[23%] shrink-0 items-center justify-center rounded-[10px] ${
                        isSelected ? "bg-[#BC87D7]" : "border border-secondaryGray bg-white"
                      }`}
                    >
                      <Text className="font-inter-medium text-[13px] text-black">
                        {formatStudyHourLabel(hour)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
