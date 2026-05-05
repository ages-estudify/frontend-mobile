import { Redirect } from "expo-router";
import React from "react";

export default function PaywallRedirect() {
  return <Redirect href="/plans" />;
}
