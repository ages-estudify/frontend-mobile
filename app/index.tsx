import { Redirect, type RelativePathString } from "expo-router";
import React from "react";

export default function Index() {
  return <Redirect href={"/(tabs)/treinar" as RelativePathString} />;
}
