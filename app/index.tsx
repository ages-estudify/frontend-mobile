import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Button } from "react-native";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const { logout } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.replace("/login");
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
    <View className="flex-1 justify-center items-center">
      <Text>Home</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
        color="#007bff"
      />
    </View>
  );
}
