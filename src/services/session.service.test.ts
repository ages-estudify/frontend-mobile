import * as SecureStore from "expo-secure-store";

import { clearSession, loadSession, saveSession } from "./session.service";

const store = SecureStore as jest.Mocked<typeof SecureStore>;

describe("session.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loadSession null quando vazio", async () => {
    store.getItemAsync.mockResolvedValueOnce(null);
    await expect(loadSession()).resolves.toBeNull();
  });

  it("loadSession parse válido", async () => {
    store.getItemAsync.mockResolvedValueOnce(
      JSON.stringify({ token: "a", role: "USER", planActive: true })
    );
    await expect(loadSession()).resolves.toEqual({
      token: "a",
      role: "USER",
      planActive: true,
    });
  });

  it("saveSession grava JSON", async () => {
    await saveSession({ token: "x", role: "USER", planActive: false });
    expect(store.setItemAsync).toHaveBeenCalled();
  });

  it("clearSession remove", async () => {
    await clearSession();
    expect(store.deleteItemAsync).toHaveBeenCalled();
  });

  it("loadSession retorna null para JSON inválido", async () => {
    store.getItemAsync.mockResolvedValueOnce("not-json");
    await expect(loadSession()).resolves.toBeNull();
  });
});
