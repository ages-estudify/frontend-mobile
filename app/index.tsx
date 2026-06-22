import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, type RelativePathString } from "expo-router";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [target, setTarget] = useState<RelativePathString | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (active) {
        setTarget((token ? "/(tabs)/treinar" : "/login") as RelativePathString);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!target) return null;

  return <Redirect href={target} />;
}
