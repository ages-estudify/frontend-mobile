import { Redirect } from "expo-router";
import React from "react";

/** Deep links antigos: envia para planos em vez de manter tela dedicada. */
export default function PaywallRedirect() {
  return <Redirect href="/planos" />;
}
