import { PlanGuard } from "@/components/navigation/PlanGuard";

import React from "react";
import ModulePlaceholder from "./_module-placeholder";

export default function ProgressoRoute() {
  return (
    <PlanGuard>
      <ModulePlaceholder title="Progresso" description="Acompanhe sua evolução." />
    </PlanGuard>
  );
}
