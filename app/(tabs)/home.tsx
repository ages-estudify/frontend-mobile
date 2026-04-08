import { SafeAreaView } from "react-native-safe-area-context";

import { HomeContent } from "@/components/home/HomeContent";
import { useAuth } from "@/providers/AuthProvider";

export default function HomeRoute() {
  const { session } = useAuth();
  const planLabel = session ? (session.planActive ? "ativo" : "inativo") : null;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <HomeContent planLabel={planLabel} />
    </SafeAreaView>
  );
}
