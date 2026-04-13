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
  return (
    <SequenceBadge
      sequence={null}
      isLoading={false}
      hasError={false}
      description={descriptionsByVariant[variant]}
    />
  );
}
