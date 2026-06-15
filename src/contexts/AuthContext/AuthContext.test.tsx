import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Pressable, Text } from "react-native";
import { AuthProvider, useAuthSession } from "./AuthContext";

function SessionProbe() {
  const s = useAuthSession();
  return (
    <>
      <Text testID="hydrated">{String(s.hydrated)}</Text>
      <Text testID="role">{s.role}</Text>
      <Text testID="plan">{s.planExpirationDate ?? "null"}</Text>
      <Pressable
        testID="set-user-future"
        onPress={() => s.setSessionFromCredentials("USER", "2099-01-01T00:00:00.000Z")}
      />
      <Pressable
        testID="update-plan"
        onPress={() => {
          void s.updatePlanExpirationDate("2099-12-01T00:00:00.000Z");
        }}
      />
      <Pressable testID="clear" onPress={() => s.clearSessionMetadata()} />
    </>
  );
}

describe("AuthProvider", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("hidrata role e planExpirationDate do AsyncStorage", async () => {
    await AsyncStorage.setItem("role", "USER");
    await AsyncStorage.setItem("planExpirationDate", "2099-06-15T12:00:00.000Z");

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("hydrated").props.children).toBe("true");
    });
    expect(screen.getByTestId("role").props.children).toBe("USER");
    expect(screen.getByTestId("plan").props.children).toBe("2099-06-15T12:00:00.000Z");
  });

  it("setSessionFromCredentials atualiza estado síncrono", async () => {
    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("hydrated").props.children).toBe("true");
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId("set-user-future"));
    });

    expect(screen.getByTestId("role").props.children).toBe("USER");
    expect(screen.getByTestId("plan").props.children).toBe("2099-01-01T00:00:00.000Z");
  });

  it("updatePlanExpirationDate persiste e atualiza estado", async () => {
    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("hydrated").props.children).toBe("true");
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId("set-user-future"));
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId("update-plan"));
    });

    expect(screen.getByTestId("plan").props.children).toBe("2099-12-01T00:00:00.000Z");
    const stored = await AsyncStorage.getItem("planExpirationDate");
    expect(stored).toBe("2099-12-01T00:00:00.000Z");
  });

  it("clearSessionMetadata zera plano e role USER", async () => {
    await AsyncStorage.setItem("role", "ADM");
    await AsyncStorage.setItem("planExpirationDate", "2099-01-01T00:00:00.000Z");

    render(
      <AuthProvider>
        <SessionProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("hydrated").props.children).toBe("true");
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId("clear"));
    });

    expect(screen.getByTestId("role").props.children).toBe("USER");
    expect(screen.getByTestId("plan").props.children).toBe("null");
  });
});
