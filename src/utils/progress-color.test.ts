import { getProgressColor } from "./progress-color";

describe("getProgressColor", () => {
  it("retorna vermelho para progresso baixo", () => {
    expect(getProgressColor(0)).toBe("#DD5454");
    expect(getProgressColor(19)).toBe("#DD5454");
  });

  it("retorna tons intermediários conforme a porcentagem", () => {
    expect(getProgressColor(20)).toBe("#DD8B54");
    expect(getProgressColor(40)).toBe("#DDA854");
    expect(getProgressColor(60)).toBe("#CFDD54");
    expect(getProgressColor(80)).toBe("#DDD254");
  });

  it("retorna verde para progresso completo", () => {
    expect(getProgressColor(100)).toBe("#B5DD54");
  });

  it("limita valores acima de 100 e abaixo de 0", () => {
    expect(getProgressColor(150)).toBe("#B5DD54");
    expect(getProgressColor(-10)).toBe("#DD5454");
  });

  it("trata valores inválidos como zero", () => {
    expect(getProgressColor(Number.NaN)).toBe("#DD5454");
  });
});
