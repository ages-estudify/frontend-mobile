import { PlanGuard } from "@/components/navigation/PlanGuard";

import React from "react";
import ModulePlaceholder from "./_module-placeholder";

export default function TreinarRoute() {
  return (
    <PlanGuard>
      <ModulePlaceholder title="Treinar" description="Pratique com foco no seu edital." />
    </PlanGuard>
  );
}
