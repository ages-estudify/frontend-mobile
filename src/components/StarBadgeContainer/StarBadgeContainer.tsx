import { StarBadge } from "@/components/StarBadge";
import { useStars } from "@/hooks/useStars";
import React from "react";

type StarBadgeVariant = "treinar" | "progresso";

interface StarBadgeContainerProps {
  variant: StarBadgeVariant;
}

const descriptionsByVariant: Record<StarBadgeVariant, string> = {
  treinar: "Responda questões e ganhe mais",
  progresso: "Representa o número total de questões que você já respondeu.",
};

export function StarBadgeContainer({ variant }: StarBadgeContainerProps) {
  const { stars, isLoading, hasError } = useStars();

  return (
    <StarBadge
      stars={stars}
      isLoading={isLoading}
      hasError={hasError}
      description={descriptionsByVariant[variant]}
    />
  );
}
