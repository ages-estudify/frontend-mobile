import { PlanGuard } from "@/components/navigation/PlanGuard";

import { ModulePlaceholder } from "./_module-placeholder";

export default function SimuladosRoute() {
  return (
    <PlanGuard>
      <ModulePlaceholder
        title="Simulados"
        description="Simule a prova no tempo real."
      />
    </PlanGuard>
  );
}
