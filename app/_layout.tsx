import { StarsInitializer } from "@/components/StarsInitializer";
import { AuthProvider } from "@/contexts/AuthContext";
import { StarsProvider } from "@/contexts/StarsContext";
import { useAssets } from "expo-asset";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";

const APP_IMAGES = [
  require("../assets/User.png"),
  require("../assets/estu-book.png"),
  require("../assets/tabIcons/workout_symbol.png"),
  require("../assets/tabIcons/simulate_symbol.png"),
  require("../assets/tabIcons/progress_symbol.png"),
  require("../assets/tabIcons/schedule_symbol.png"),
];

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Medium": Inter_500Medium,
  });

  const [assetsLoaded] = useAssets(APP_IMAGES);

  if (!fontsLoaded || !assetsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StarsProvider>
            <StarsInitializer />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{ title: "HomePage" }} />
              <Stack.Screen name="login" options={{ title: "LoginPage" }} />
              <Stack.Screen name="intro" options={{ title: "IntroPage" }} />
              <Stack.Screen name="register" options={{ title: "RegisterPage" }} />
              <Stack.Screen name="plans" options={{ title: "PlansPage" }} />
              <Stack.Screen name="paywall" options={{ title: "PaywallPage" }} />
              <Stack.Screen name="subject" options={{ title: "Subject" }} />
              <Stack.Screen name="question" options={{ title: "Question" }} />
              <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
              <Stack.Screen name="(tabs)" />
            </Stack>

            <StatusBar style="auto" />
          </StarsProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
