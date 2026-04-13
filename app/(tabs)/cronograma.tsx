import { PlanGuard } from "@/components/navigation/PlanGuard";

import React from "react";
import ModulePlaceholder from "./_module-placeholder";

export default function CronogramaRoute() {
  return (
    <PlanGuard>
      <ModulePlaceholder title="Cronograma" description="Organize seus estudos por dia." />
    </PlanGuard>
  );
}
