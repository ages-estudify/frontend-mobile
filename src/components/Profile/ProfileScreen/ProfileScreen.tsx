import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthSession } from "@/contexts/AuthContext";
import {
  formatPreferredLanguage,
  formatStudyHourLabel,
  getSelectedStudyDays,
  getUniqueStudyHours,
  STUDY_DAY_LABELS,
} from "@/utils/studySchedule";
import { hasGatedContentAccess } from "@/utils/subscription-access";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function ProfileInfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center justify-between py-[14px]">
      <View className="min-w-0 flex-1 flex-row items-center gap-[12px]">
        <Ionicons name={icon} size={20} color="#646464" />
        <Text className="font-inter text-[15px] text-primaryGray">{label}</Text>
      </View>
      <Text className="ml-3 max-w-[48%] text-right font-inter-semi text-[15px] text-black">
        {value}
      </Text>
    </View>
  );
}

type ActionRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

function ProfileActionRow({ icon, label, onPress, destructive = false }: ActionRowProps) {
  const textColor = destructive ? "text-red100" : "#646464";
  const iconColor = destructive ? "#D43B3B" : "#646464";

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-[16px] border border-cardBorder bg-white px-[18px] py-[16px]"
    >
      <View className="flex-row items-center gap-[12px]">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text className={`font-inter-regular text-[16px] ${textColor}`}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={destructive ? "#D43B3B" : "#646464"} />
    </Pressable>
  );
}

function ProfileChip({ label }: { label: string }) {
  return (
    <View className="min-w-[72px] items-center rounded-[12px] border border-cardBorder bg-white px-[16px] py-[12px]">
      <Text className="font-inter-medium text-[15px] text-black">{label}</Text>
    </View>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-[20px]">
      <Text className="mb-[10px] font-inter-semi text-[15px] text-primaryGray">{title}</Text>
      {children}
    </View>
  );
}

function EmptyChipState({ message }: { message: string }) {
  return (
    <View className="rounded-[12px] border border-cardBorder bg-white px-[16px] py-[12px]">
      <Text className="font-inter text-[14px] text-primaryGray">{message}</Text>
    </View>
  );
}

function ProfileFeedbackState({
  message,
  onRetry,
  loading,
}: {
  message?: string;
  onRetry: () => void;
  loading?: boolean;
}) {
  return (
    <View className="items-center rounded-[16px] border border-cardBorder bg-white px-[16px] py-[24px]">
      {loading ? (
        <>
          <ActivityIndicator size="large" />
          <Text className="mt-[12px] font-inter text-[15px] text-primaryGray">
            Carregando perfil...
          </Text>
        </>
      ) : (
        <>
          <Text className="text-center font-inter-medium text-[15px] text-primaryGray">
            {message}
          </Text>
          <Pressable
            onPress={onRetry}
            className="mt-[16px] rounded-[12px] bg-black px-[18px] py-[10px]"
          >
            <Text className="font-inter-semi text-[14px] text-white">Tentar novamente</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

function formatPlanStatus(status?: string): string {
  if (status === "active") return "Ativo";
  if (status === "inactive") return "Inativo";
  return status ?? "—";
}

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { profile, loading, error, reload } = useUserProfile();
  const { role, planExpirationDate } = useAuthSession();

  const planStatus = profile?.planStatus
    ? formatPlanStatus(profile.planStatus)
    : hasGatedContentAccess(role, planExpirationDate)
      ? "Ativo"
      : "Inativo";
  const studyDays = getSelectedStudyDays(profile?.studyHours);
  const studyHours = getUniqueStudyHours(profile?.studyHours);
  const headerHeight = 148 + insets.top;
  const shouldRenderProfileContent = Boolean(profile) || (!loading && !error);

  return (
    <View className="flex-1 bg-whitebg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="relative mb-[12px]">
          <ImageBackground
            source={require("../../../../assets/profile_background.png")}
            resizeMode="cover"
            className="overflow-hidden rounded-b-[28px]"
            style={{ height: headerHeight }}
          />

          <Pressable
            onPress={() => router.back()}
            style={{ top: insets.top + 8 }}
            className="absolute left-[16px] h-[40px] w-[40px] items-center justify-center rounded-full bg-white"
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={20} color="#000000" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/onboarding?mode=edit")}
            style={{ top: insets.top + 8 }}
            className="absolute right-[16px] h-[40px] w-[40px] items-center justify-center rounded-full bg-white"
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <Ionicons name="create-outline" size={18} color="#000000" />
          </Pressable>

          <View className="-mt-[44px] items-center">
            <Image
              source={require("../../../../assets/placeholder_user.png")}
              className="h-[88px] w-[88px] rounded-full border-4 border-whitebg"
              resizeMode="cover"
            />
            <Text className="mt-[12px] px-[16px] text-center font-poppins-semi text-[28px] text-black">
              {profile?.fullName?.trim() || "Usuário"}
            </Text>
          </View>
        </View>

        <View className="px-[16px]">
          {loading && !profile ? (
            <ProfileFeedbackState loading onRetry={reload} />
          ) : error && !profile ? (
            <ProfileFeedbackState message={error} onRetry={reload} />
          ) : null}

          {error && profile ? (
            <View className="mb-[16px] rounded-[12px] border border-cardBorder bg-white px-[16px] py-[12px]">
              <Text className="font-inter text-[14px] text-primaryGray">{error}</Text>
            </View>
          ) : null}

          {shouldRenderProfileContent ? (
            <>
              <ProfileSection title="Informações">
                <View className="rounded-[16px] border border-cardBorder bg-white px-[16px]">
                  <ProfileInfoRow
                    icon="person-outline"
                    label="Nome Completo"
                    value={profile?.fullName?.trim() || "—"}
                  />
                  <View className="h-px bg-cardBorder" />
                  <ProfileInfoRow
                    icon="globe-outline"
                    label="Email"
                    value={profile?.email?.trim() || "—"}
                  />
                  <View className="h-px bg-cardBorder" />
                  <ProfileInfoRow
                    icon="stats-chart-outline"
                    label="Situação do Plano"
                    value={planStatus}
                  />
                  <View className="h-px bg-cardBorder" />
                  <ProfileInfoRow
                    icon="heart-outline"
                    label="Curso Desejado"
                    value={profile?.desiredCourse?.trim() || "—"}
                  />
                  <View className="h-px bg-cardBorder" />
                  <ProfileInfoRow
                    icon="chatbubble-outline"
                    label="Língua Estrangeira"
                    value={formatPreferredLanguage(profile?.preferredLanguage)}
                  />
                  <View className="h-px bg-cardBorder" />
                  <ProfileInfoRow
                    icon="business-outline"
                    label="Universidade Desejada"
                    value={profile?.desiredUniversity?.trim() || "—"}
                  />
                </View>
              </ProfileSection>

              <ProfileSection title="Dias de Estudo">
                {studyDays.length > 0 ? (
                  <View className="flex-row flex-wrap gap-[10px]">
                    {studyDays.map((day) => (
                      <ProfileChip key={day} label={STUDY_DAY_LABELS[day]} />
                    ))}
                  </View>
                ) : (
                  <EmptyChipState message="Nenhum dia de estudo configurado." />
                )}
              </ProfileSection>

              <ProfileSection title="Horários de Estudo">
                {studyHours.length > 0 ? (
                  <View className="flex-row flex-wrap gap-[10px]">
                    {studyHours.map((hour) => (
                      <ProfileChip key={hour} label={formatStudyHourLabel(hour)} />
                    ))}
                  </View>
                ) : (
                  <EmptyChipState message="Nenhum horário de estudo configurado." />
                )}
              </ProfileSection>

              <ProfileSection title="Ações">
                <View className="gap-[10px]">
                  <ProfileActionRow
                    icon="settings-outline"
                    label="Gerenciar Planos"
                    onPress={() => router.push("/plans")}
                  />
                  <ProfileActionRow
                    icon="log-out-outline"
                    label="Sair da conta"
                    onPress={() => void logout()}
                    destructive
                  />
                </View>
              </ProfileSection>

              <ProfileSection title="Suporte e Contato">
                <View className="rounded-[16px] border border-cardBorder bg-white px-[16px] py-[4px]">
                  <View className="flex-row items-center gap-[12px] py-[14px]">
                    <Ionicons name="mail-outline" size={20} color="#646464" />
                    <Text className="font-inter text-[15px] text-primaryGray">
                      contatoestudifyapp@gmail.com
                    </Text>
                  </View>
                  <View className="h-px bg-cardBorder" />
                  <View className="flex-row items-center gap-[12px] py-[14px]">
                    <Ionicons name="call-outline" size={20} color="#646464" />
                    <Text className="font-inter text-[15px] text-primaryGray">
                      +55 51 99908-9542
                    </Text>
                  </View>
                </View>
              </ProfileSection>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
