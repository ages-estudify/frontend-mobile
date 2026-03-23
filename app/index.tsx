import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Welcome
        </Text>
        <Text className="mt-3 text-center text-base text-neutral-600 dark:text-neutral-400">
          Expo Router + NativeWind. Edit{" "}
          <Text className="font-semibold text-blue-600 dark:text-blue-400">
            app/index.tsx
          </Text>{" "}
          to get started.
        </Text>
      </View>
    </SafeAreaView>
  );
}
