import api, { handleApiError } from "@/services/api";
import { Exam } from "@/types/exam.types";
import { getExams } from "./exam.service";

jest.mock("@/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  handleApiError: jest.fn(),
}));

const mockedGet = api.get as jest.Mock;

describe("exam.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("chama GET /exams/by-user e ordena os exames por status", async () => {
    const exams = [
      { id: "c", status: "completed" },
      { id: "a", status: "available" },
      { id: "p", status: "in_progress" },
    ] as unknown as Exam[];

    mockedGet.mockResolvedValue({ success: true, data: exams });

    const result = await getExams();

    expect(mockedGet).toHaveBeenCalledWith("/exams/by-user");
    expect(result.map((e) => e.id)).toEqual(["p", "a", "c"]);
  });

  it("coloca status desconhecidos no final", async () => {
    const exams = [
      { id: "x", status: "unknown" },
      { id: "p", status: "in_progress" },
    ] as unknown as Exam[];

    mockedGet.mockResolvedValue({ success: true, data: exams });

    const result = await getExams();

    expect(result.map((e) => e.id)).toEqual(["p", "x"]);
  });

  it("chama handleApiError e retorna lista vazia quando a requisição falha", async () => {
    const error = new Error("Erro na API");
    mockedGet.mockRejectedValue(error);

    const result = await getExams();

    expect(handleApiError).toHaveBeenCalledWith(error);
    expect(result).toEqual([]);
  });
});
