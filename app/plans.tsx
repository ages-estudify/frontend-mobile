import { CARD_W, PlanCard, type Plan } from "@/components/PlanCard";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionService } from "@/services/subscription/subscription.service";
import type { PlanType } from "@/types/subscription.types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React, { useRef, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View, type ViewToken } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledArrowLeft = cssInterop(ArrowLeft, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

const CARD_H_PAD = 16;
const CARD_GAP = 8;

const COMMON_FEATURES = [
  "Simulados",
  "Questões ilimitadas",
  "Gabarito Comentado ilimitado",
  "Cronograma Personalizado",
  "Comunidade Estudify",
];

const PLANS: Plan[] = [
  {
    planType: "TRIMESTRAL",
    title: "Plano Trimestral",
    price: "R$ 39,90",
    period: "por mês",
    paymentNote: "Pagamento único de\nR$ 119,70",
    features: COMMON_FEATURES,
  },
  {
    planType: "ANUAL",
    title: "Plano Anual",
    price: "R$ 19,90",
    period: "por mês",
    paymentNote: "Pagamento único de\nR$ 238,70",
    features: COMMON_FEATURES,
  },
];

export default function PlanosScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList<Plan>>(null);
  const router = useRouter();
  const { updateSession } = useAuth();

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleSubscribe = async (planType: PlanType) => {
    setIsLoading(true);

    try {
      const response = await subscriptionService.subscribe({ planType });

      const { token, refreshToken, planExpirationDate } = response.data;

      await updateSession(token, refreshToken, planExpirationDate);

      router.replace("/");
      Alert.alert("Bem-vindo!", "Seu plano foi ativado com sucesso. Bons estudos! 🎉");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Erro ao ativar plano";

      Alert.alert("Erro", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} className="bg-whitebg">
      <View style={styles.container} className="bg-whitebg">
        <View>
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/treinar");
                }
              }}
              style={styles.backBtn}
              className="bg-white"
              testID="back-button"
            >
              <StyledArrowLeft size={24} className="text-purple100" />
            </Pressable>

            <Text style={styles.headerTitle} className="font-poppins-semi text-purple100">
              Planos
            </Text>
          </View>

          <Text style={styles.subtitle} className="font-inter-semi text-black">
            Selecione o plano de sua preferência
          </Text>
        </View>

        <View>
          <FlatList
            ref={flatListRef}
            data={PLANS}
            keyExtractor={(item) => item.planType}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.carousel}
            renderItem={({ item, index }) => (
              <PlanCard
                plan={item}
                isActive={index === activeIndex}
                isLoading={isLoading}
                onSubscribe={() => handleSubscribe(item.planType)}
              />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            testID="plans-carousel"
          />

          <View style={styles.dotsRow}>
            {PLANS.map((_, index) => (
              <View
                key={index}
                style={styles.dot}
                className={index === activeIndex ? "bg-black" : "bg-secondaryGray"}
              />
            ))}
          </View>
        </View>

        <View style={styles.mascotRow}>
          <Image
            source={require("../assets/estu-book.png")}
            style={styles.mascotImage}
            contentFit="contain"
          />

          <View style={styles.bubbleWrapper}>
            <View style={styles.bubbleContainer}>
              <View
                style={styles.bubbleTail}
                className="border-b-transparent border-r-greenBubble border-t-transparent"
              />

              <View style={styles.bubble} className="bg-greenBubble">
                <Text
                  style={styles.bubbleText}
                  className="text-black"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                >
                  O Estu recomenda o plano
                </Text>

                <Text style={styles.bubbleText} className="text-black" numberOfLines={1}>
                  anual!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingBottom: 30,
    justifyContent: "space-between",
  },

  headerRow: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },

  headerTitle: {
    fontSize: 22,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 20,
  },

  carousel: {
    paddingHorizontal: CARD_H_PAD,
    gap: CARD_GAP,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  mascotRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 22,
    marginTop: 4,
  },

  mascotImage: {
    width: 135,
    height: 125,
    zIndex: 2,
  },

  bubbleWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: -8,
    paddingBottom: 40,
  },

  bubbleContainer: {
    width: 226,
    position: "relative",
    justifyContent: "center",
  },

  bubbleTail: {
    position: "absolute",
    left: -14,
    top: "50%",
    marginTop: -8,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 14,
    zIndex: 1,
  },

  bubble: {
    height: 54,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  bubbleText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
