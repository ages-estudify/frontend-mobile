import { useStreak } from "@/hooks/useStreak";
import React from "react";
import { SequenceBadge } from "./SequenceBadge";

type SequenceBadgeVariant = "treinar" | "progresso";

interface SequenceBadgeContainerProps {
  variant: SequenceBadgeVariant;
}

const descriptionsByVariant: Record<SequenceBadgeVariant, string> = {
  treinar: "Continue treinando!",
  progresso: "Representa quantos dias consecutivos você tem estudado na plataforma.",
};

export function SequenceBadgeContainer({ variant }: SequenceBadgeContainerProps) {
  const { streakDays, streakActive, isLoading, hasError } = useStreak();

  return (
    <SequenceBadge
      sequence={streakDays}
      streakActive={streakActive}
      isLoading={isLoading}
      hasError={hasError}
      description={descriptionsByVariant[variant]}
    />
  );
}
