import type { PlanType } from "@/types/subscription.types";
import React from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

export const CARD_W = SCREEN_W - 40;

export interface Plan {
  planType: PlanType;
  title: string;
  price: string;
  period: string;
  paymentNote: string;
  features: string[];
}

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
}

export function PlanCard({ plan, isActive, isLoading, onSubscribe }: PlanCardProps) {
  return (
    <View className="rounded-2xl bg-white px-5 py-6" style={{ width: CARD_W }}>
      <Text className="mb-2 text-center font-poppins-semi text-[20px] text-black">
        {plan.title}
      </Text>

      <Text className="text-center text-[48px] font-bold text-purplePrice" style={styles.price}>
        {plan.price}
      </Text>

      <Text className="mt-0.5 text-center font-inter text-[13px] text-primaryGray">
        {plan.period}
      </Text>

      <View className="mx-4 my-3 h-px bg-featureGray" />

      {plan.paymentNote.split("\n").map((line, index) => (
        <Text
          key={line}
          className={
            index === 0
              ? "text-center font-inter text-[10px] text-primaryGray"
              : "mb-4 mt-0.5 text-center text-[16px] font-bold text-black"
          }
          style={index === 1 ? styles.paymentValue : undefined}
        >
          {line}
        </Text>
      ))}

      <View className="mb-5 gap-2 rounded-xl bg-featureGray p-3.5">
        <Text className="mb-3 text-center font-inter-semi text-[13px] text-black">
          O que está incluso:
        </Text>

        {plan.features.map((feature) => (
          <View key={feature} className="flex-row items-center gap-2">
            <View
              className="items-center justify-center rounded-full border border-purplePrice"
              style={styles.checkCircle}
            >
              <Text className="font-inter-semi text-[9px] text-purplePrice">✓</Text>
            </View>

            <Text className="flex-1 font-inter text-[13px] text-black">{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable
        testID={isActive ? "subscribe-button" : undefined}
        className="h-10 items-center justify-center rounded-[15px] bg-purpleCalm"
        style={isLoading ? styles.disabledButton : undefined}
        onPress={onSubscribe}
        disabled={isLoading}
        accessibilityState={{ disabled: isLoading }}
      >
        {isLoading && isActive ? (
          <ActivityIndicator color="white" testID="loading-indicator" />
        ) : (
          <Text className="font-poppins-semi text-[15px] text-white">Assinar agora</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  price: {
    lineHeight: 48,
  },

  paymentValue: {
    lineHeight: 16,
  },

  checkCircle: {
    width: 14,
    height: 14,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
