import SubjectBox from "@/components/SubjectBox";
import { useAuth } from "@/hooks/useAuth";
import { RelativePathString, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.replace("/login" as RelativePathString);
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <SubjectBox subject="Matemática" icon="https://www.svgrepo.com/show/532033/cloud.svg" />
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Welcome</Text>
        <Text className="mt-3 text-center text-base text-neutral-600 dark:text-neutral-400">
          Expo Router + NativeWind. Edit{" "}
          <Text className="font-semibold text-blue-600 dark:text-blue-400">app/index.tsx</Text> to
          get started.
        </Text>
      </View>
    </SafeAreaView>
  );
}
