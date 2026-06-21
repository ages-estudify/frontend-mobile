import GraphCard from "@/components/graphCard";
import { SequenceBadge } from "@/components/SequenceBadge";
import { StarBadge } from "@/components/StarBadge";
import { getTrainingResult } from "@/services/question/question.service";
import { TrainingResultResponse } from "@/types/questions.types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const celebratingFox = require("../assets/celebratingFox.png");
const supportFox = require("../assets/suport-fox.png");

function getParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseQuestionIds(value: string | undefined): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((questionId): questionId is string => typeof questionId === "string");
  } catch {
    return [];
  }
}

function parseNumberParam(value: string | undefined) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseBooleanParam(value: string | undefined) {
  if (value === "true") return true;
  if (value === "false") return false;

  return null;
}

function getAccuracyRate(result: TrainingResultResponse | null) {
  if (!result || result.totalQuestions <= 0) return 0;

  return result.correctAnswers / result.totalQuestions;
}

export function getTrainingMotivationalMessage(result: TrainingResultResponse | null) {
  const accuracyRate = getAccuracyRate(result);

  if (accuracyRate >= 0.75) return "Excelente Desempenho!";
  if (accuracyRate >= 0.5) return "Bom Desempenho!";

  return "Continue treinando!";
}

function getErrorMessage(status?: number) {
  if (status === 400) {
    return "Não foi possível carregar o resultado: sessão inválida ou incompleta";
  }

  if (status === 403) {
    return "Sua assinatura expirou";
  }

  if (status === 404) {
    return "Algumas questões não foram encontradas";
  }

  return "Erro ao carregar resultado";
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const possibleError = error as {
    status?: number;
    statusCode?: number;
    response?: {
      status?: number;
      data?: {
        status?: number;
        statusCode?: number;
      };
    };
  };

  return (
    possibleError.statusCode ??
    possibleError.status ??
    possibleError.response?.data?.statusCode ??
    possibleError.response?.data?.status ??
    possibleError.response?.status
  );
}

interface TrainingGamificationCardProps {
  sessionCoins: number;
  streakDays: number | null;
  streakActive: boolean | null;
}

function TrainingGamificationCard({
  sessionCoins,
  streakDays,
  streakActive,
}: TrainingGamificationCardProps) {
  const streakStatus =
    streakActive === null
      ? "Status da streak indisponível"
      : streakActive
        ? "Streak ativa"
        : "Streak inativa";

  return (
    <View>
      <Text className="mb-[10px] font-inter-semi text-[15px] text-black">Ganhos da sessão</Text>

      <View className="gap-[10px]">
        <SequenceBadge
          sequence={streakDays}
          streakActive={streakActive}
          isLoading={false}
          hasError={false}
          title={`Streak atual: ${streakDays ?? "--"}`}
          description={streakStatus}
          containerClassName="h-[76px]"
          textNumberOfLines={1}
        />

        <StarBadge
          stars={sessionCoins}
          isLoading={false}
          hasError={false}
          title={`Moedas ganhas: +${sessionCoins}`}
          description="Ganhos desta sessão"
          containerClassName="h-[76px]"
          textNumberOfLines={1}
        />
      </View>
    </View>
  );
}

export default function TrainingResult() {
  const params = useLocalSearchParams<{
    questionIds?: string;
    sessionCoins?: string;
    streakDays?: string;
    streakActive?: string;
  }>();
  const router = useRouter();

  const questionIds = useMemo(
    () => parseQuestionIds(getParamValue(params.questionIds)),
    [params.questionIds]
  );
  const sessionCoins = parseNumberParam(getParamValue(params.sessionCoins));
  const streakDaysParam = getParamValue(params.streakDays);
  const streakDays = streakDaysParam ? parseNumberParam(streakDaysParam) : null;
  const streakActive = parseBooleanParam(getParamValue(params.streakActive));

  const [result, setResult] = useState<TrainingResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTrainingResult = async () => {
      if (questionIds.length === 0) {
        setErrorMessage(getErrorMessage(400));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getTrainingResult(questionIds);

        if (!isMounted) return;

        setResult(response);
      } catch (error) {
        if (!isMounted) return;

        const status = getErrorStatus(error);

        if (status === 401) {
          router.replace("/login");
        }

        setErrorMessage(getErrorMessage(status));
        setResult(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrainingResult();

    return () => {
      isMounted = false;
    };
  }, [questionIds, router]);

  const motivationalMessage = getTrainingMotivationalMessage(result);
  const foxImage = result && getAccuracyRate(result) < 0.5 ? supportFox : celebratingFox;

  return (
    <SafeAreaView className="flex-1 bg-whitebg">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-8 pt-8">
          <View>
            <Text className="text-2xl font-semibold">Resultados do Treino</Text>
          </View>

          <View className="items-center justify-center gap-[18px]">
            <Image className="h-[102px] w-[102px]" source={foxImage} resizeMode="contain" />

            {isLoading ? (
              <View className="items-center gap-3">
                <ActivityIndicator />
                <Text className="text-xl font-semibold">Carregando resultado...</Text>
              </View>
            ) : errorMessage ? (
              <Text className="text-center text-xl font-semibold text-red100">{errorMessage}</Text>
            ) : (
              <Text className="text-2xl font-semibold">{motivationalMessage}</Text>
            )}
          </View>

          <TrainingGamificationCard
            sessionCoins={sessionCoins}
            streakDays={streakDays}
            streakActive={streakActive}
          />

          {!isLoading && !errorMessage && result ? (
            <View className="h-[143px]">
              <GraphCard
                totalQuestions={result.totalQuestions}
                correct={result.correctAnswers}
                incorrect={result.wrongAnswers}
                blank={0}
                showBlank={false}
              />
            </View>
          ) : null}

          <View className="mt-auto pt-4">
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/treinar")}
              className="rounded-xl bg-purpleCalm p-4"
            >
              <Text className="text-center font-bold text-white">Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
