import {
  formatPreferredLanguage,
  formatStudyHourLabel,
  getSelectedStudyDays,
  getUniqueStudyHours,
  STUDY_DAY_LABELS,
} from "./studySchedule";

describe("studySchedule", () => {
  describe("formatPreferredLanguage", () => {
    it("retorna traço quando não há idioma", () => {
      expect(formatPreferredLanguage()).toBe("—");
      expect(formatPreferredLanguage("")).toBe("—");
    });

    it("traduz idiomas conhecidos", () => {
      expect(formatPreferredLanguage("ENGLISH")).toBe("Inglês");
      expect(formatPreferredLanguage("SPANISH")).toBe("Espanhol");
    });

    it("retorna o valor original para idiomas desconhecidos", () => {
      expect(formatPreferredLanguage("FRENCH")).toBe("FRENCH");
    });
  });

  describe("formatStudyHourLabel", () => {
    it("formata hora com zero à esquerda", () => {
      expect(formatStudyHourLabel(8)).toBe("08:00");
      expect(formatStudyHourLabel(14)).toBe("14:00");
    });
  });

  describe("getSelectedStudyDays", () => {
    it("retorna lista vazia quando não há horários", () => {
      expect(getSelectedStudyDays()).toEqual([]);
      expect(getSelectedStudyDays({})).toEqual([]);
    });

    it("retorna apenas dias com horários configurados na ordem correta", () => {
      const days = getSelectedStudyDays({
        MONDAY: [8],
        WEDNESDAY: [10, 14],
        FRIDAY: [],
      });

      expect(days).toEqual(["MONDAY", "WEDNESDAY"]);
      expect(STUDY_DAY_LABELS[days[0]]).toBe("Seg");
    });
  });

  describe("getUniqueStudyHours", () => {
    it("retorna lista vazia quando não há horários", () => {
      expect(getUniqueStudyHours()).toEqual([]);
    });

    it("retorna horários únicos ordenados", () => {
      expect(
        getUniqueStudyHours({
          MONDAY: [14, 8],
          TUESDAY: [8, 10],
        })
      ).toEqual([8, 10, 14]);
    });
  });
});
