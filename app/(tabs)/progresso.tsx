import { GatedTabScreenHeader } from "@/components/navigation/GatedTabScreenHeader";
import { PlanGuard } from "@/components/navigation/PlanGuard";
import { ProfileAvatarButton } from "@/components/navigation/ProfileAvatarButton";
import { TabScreenScrollView } from "@/components/navigation/TabScreenScrollView";
import { AccuracyBySubjectSection } from "@/components/Progress/AccuracyBySubjectSection";
import { GamificationMetrics } from "@/components/Progress/GamificationMetrics";
import { ProgressOverviewCard } from "@/components/Progress/ProgressOverviewCard";
import { ProgressSummaryCards } from "@/components/Progress/ProgressSummaryCards";
import { SimuladosProgressSection } from "@/components/Progress/SimuladosProgressSection";
import { useUserStats } from "@/hooks/useUserStats";
import React from "react";
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgressoRoute() {
  const { data, loading, error, refreshing, refreshStats, retry } = useUserStats();

  return (
    <SafeAreaView className="flex-1 bg-whitebg" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <GatedTabScreenHeader title="Meu Progresso" trailing={<ProfileAvatarButton />} />

        <PlanGuard>
          {loading && !data ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#5E4980" />
            </View>
          ) : error && !data ? (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="mb-4 text-center font-inter-medium text-[14px] text-greenPrimary">
                Algo deu errado. Tente novamente.
              </Text>

              <TouchableOpacity onPress={retry} className="rounded-full bg-purpleCalm px-6 py-3">
                <Text className="font-inter-semi text-[13px] text-white">Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TabScreenScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshStats}
                  tintColor="#5E4980"
                />
              }
            >
              <View className="w-full self-center px-4 pb-8 pt-1" style={{ maxWidth: 402 }}>
                <Text className="-mt-1 mb-[10px] font-inter text-[15px] leading-[20px] text-primaryGray">
                  Sua evolução nos estudos
                </Text>

                <ProgressOverviewCard overview={data?.overview} />

                <ProgressSummaryCards
                  level={data?.level}
                  completedTopics={data?.completedTopics}
                  accuracyPercentage={data?.overview?.accuracyPercentage}
                />

                <GamificationMetrics stars={data?.stars} streak={data?.streak} />

                <SimuladosProgressSection simulados={data?.simulados} />

                <AccuracyBySubjectSection subjects={data?.accuracyBySubject} />
              </View>
            </TabScreenScrollView>
          )}
        </PlanGuard>
      </View>
    </SafeAreaView>
  );
}
