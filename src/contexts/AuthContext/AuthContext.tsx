import { normalizeUserRole, type UserRole } from "@/utils/subscription-access";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_ROLE = "role";
const STORAGE_PLAN = "planExpirationDate";
const STORAGE_PLAN_ACTIVE = "planActive";

export type AuthSessionSnapshot = {
  hydrated: boolean;
  role: UserRole;
  planExpirationDate: string | null;
  planActive: boolean;
};

type AuthSessionContextValue = AuthSessionSnapshot & {
  // Bumped on every login/logout so other contexts can react to identity changes.
  sessionVersion: number;
  setSessionFromCredentials: (
    role: string,
    planExpirationDate: string | null,
    planActive?: boolean
  ) => void;
  updatePlanSession: (params: {
    planExpirationDate: string | null;
    planActive: boolean;
  }) => Promise<void>;
  updatePlanExpirationDate: (planExpirationDate: string | null) => Promise<void>;
  clearSessionMetadata: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

const emptySession: AuthSessionSnapshot = {
  hydrated: false,
  role: "USER",
  planExpirationDate: null,
  planActive: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthSessionSnapshot>(emptySession);
  const [sessionVersion, setSessionVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [roleRaw, planRaw, planActiveRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_ROLE),
          AsyncStorage.getItem(STORAGE_PLAN),
          AsyncStorage.getItem(STORAGE_PLAN_ACTIVE),
        ]);

        if (cancelled) return;

        const planExpirationDate = planRaw && planRaw.length > 0 ? planRaw : null;

        setState({
          hydrated: true,
          role: normalizeUserRole(roleRaw),
          planExpirationDate,
          planActive: planActiveRaw === "true",
        });
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, hydrated: true }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSessionFromCredentials = useCallback(
    (role: string, planExpirationDate: string | null, planActive = false) => {
      setState({
        hydrated: true,
        role: normalizeUserRole(role),
        planExpirationDate,
        planActive,
      });
      setSessionVersion((version) => version + 1);
    },
    []
  );

  const updatePlanSession = useCallback(
    async ({
      planExpirationDate,
      planActive,
    }: {
      planExpirationDate: string | null;
      planActive: boolean;
    }) => {
      if (planExpirationDate) {
        await AsyncStorage.setItem(STORAGE_PLAN, planExpirationDate);
      } else {
        await AsyncStorage.removeItem(STORAGE_PLAN);
      }

      await AsyncStorage.setItem(STORAGE_PLAN_ACTIVE, String(planActive));

      setState((prev) => ({
        ...prev,
        planExpirationDate,
        planActive,
      }));
    },
    []
  );

  const updatePlanExpirationDate = useCallback(async (planExpirationDate: string | null) => {
    if (planExpirationDate) {
      await AsyncStorage.setItem(STORAGE_PLAN, planExpirationDate);
    } else {
      await AsyncStorage.removeItem(STORAGE_PLAN);
    }

    setState((prev) => ({ ...prev, planExpirationDate }));
  }, []);

  const clearSessionMetadata = useCallback(() => {
    void AsyncStorage.multiRemove([STORAGE_ROLE, STORAGE_PLAN, STORAGE_PLAN_ACTIVE]);

    setState({
      hydrated: true,
      role: "USER",
      planExpirationDate: null,
      planActive: false,
    });
    setSessionVersion((version) => version + 1);
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      ...state,
      sessionVersion,
      setSessionFromCredentials,
      updatePlanSession,
      updatePlanExpirationDate,
      clearSessionMetadata,
    }),
    [
      state,
      sessionVersion,
      setSessionFromCredentials,
      updatePlanSession,
      updatePlanExpirationDate,
      clearSessionMetadata,
    ]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = useContext(AuthSessionContext);

  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthProvider");
  }

  return ctx;
}
