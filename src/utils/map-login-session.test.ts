import { mapLoginPayloadToSession } from "./map-login-session";

describe("mapLoginPayloadToSession", () => {
  it("usa planActive explícito", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: null,
        planActive: true,
      })
    ).toEqual({ token: "t", role: "USER", planActive: true });
  });

  it("planActive false explícito prevalece sobre data futura", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: "2099-01-01",
        planActive: false,
      }).planActive
    ).toBe(false);
  });

  it("deriva ativo de planExpirationDate futura", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: "2099-12-31",
      }).planActive
    ).toBe(true);
  });

  it("inativo quando planExpirationDate null", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: null,
      }).planActive
    ).toBe(false);
  });

  it("inativo quando data está no passado", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "USER",
        planExpirationDate: "2000-01-01",
      }).planActive
    ).toBe(false);
  });

  it("ativo para ADM com planExpirationDate null", () => {
    expect(
      mapLoginPayloadToSession({
        token: "t",
        refreshToken: "r",
        role: "ADM",
        planExpirationDate: null,
      })
    ).toEqual({ token: "t", role: "ADM", planActive: true });
  });
});
