import { hasGatedContentAccess, normalizeUserRole } from "./subscription-access";

describe("hasGatedContentAccess", () => {
  it("libera ADM com planExpirationDate null", () => {
    expect(hasGatedContentAccess("ADM", null)).toBe(true);
  });

  it("libera USER com data futura (>)", () => {
    expect(hasGatedContentAccess("USER", "2099-12-31T23:59:59.000Z")).toBe(true);
  });

  it("nega USER com planExpirationDate null", () => {
    expect(hasGatedContentAccess("USER", null)).toBe(false);
  });

  it("nega USER com string vazia", () => {
    expect(hasGatedContentAccess("USER", "")).toBe(false);
  });

  it("nega USER com data no passado", () => {
    expect(hasGatedContentAccess("USER", "2000-01-01T00:00:00.000Z")).toBe(false);
  });

  it("nega data ISO inválida", () => {
    expect(hasGatedContentAccess("USER", "not-a-date")).toBe(false);
  });
});

describe("normalizeUserRole", () => {
  it("normaliza ADM", () => {
    expect(normalizeUserRole("ADM")).toBe("ADM");
  });

  it("default USER para null ou outro valor", () => {
    expect(normalizeUserRole(null)).toBe("USER");
    expect(normalizeUserRole("ADMIN")).toBe("USER");
  });
});
