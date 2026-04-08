import "../global.css";

import { StarsInitializer } from "@/components/StarsInitializer";
import { StarsProvider } from "@/contexts/StarsContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Medium": Inter_500Medium,
  });

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StarsProvider>
          <StarsInitializer />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: "HomePage" }} />
            <Stack.Screen name="login" options={{ title: "LoginPage" }} />
            <Stack.Screen name="progress" options={{ title: "ProgressPage" }} />
            <Stack.Screen name="subject" options={{ title: "Subject" }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="question" options={{ title: "Question" }} />
          </Stack>

          <StatusBar style="auto" />
        </StarsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
