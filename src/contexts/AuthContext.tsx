import { normalizeUserRole, type UserRole } from "@/utils/subscription-access";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_ROLE = "role";
const STORAGE_PLAN = "planExpirationDate";

export type AuthSessionSnapshot = {
  hydrated: boolean;
  role: UserRole;
  planExpirationDate: string | null;
};

type AuthSessionContextValue = AuthSessionSnapshot & {
  setSessionFromCredentials: (role: string, planExpirationDate: string | null) => void;
  updatePlanExpirationDate: (planExpirationDate: string | null) => Promise<void>;
  clearSessionMetadata: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

const emptySession: AuthSessionSnapshot = {
  hydrated: false,
  role: "USER",
  planExpirationDate: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthSessionSnapshot>(emptySession);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [roleRaw, planRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_ROLE),
          AsyncStorage.getItem(STORAGE_PLAN),
        ]);
        if (cancelled) return;
        const planExpirationDate = planRaw && planRaw.length > 0 ? planRaw : null;
        setState({
          hydrated: true,
          role: normalizeUserRole(roleRaw),
          planExpirationDate,
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
    (role: string, planExpirationDate: string | null) => {
      setState({
        hydrated: true,
        role: normalizeUserRole(role),
        planExpirationDate,
      });
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
    setState({
      hydrated: true,
      role: "USER",
      planExpirationDate: null,
    });
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      ...state,
      setSessionFromCredentials,
      updatePlanExpirationDate,
      clearSessionMetadata,
    }),
    [state, setSessionFromCredentials, updatePlanExpirationDate, clearSessionMetadata]
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
