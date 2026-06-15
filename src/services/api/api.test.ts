jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

jest.mock("axios", () => {
  const createInstance = (config: { baseURL?: string; headers?: Record<string, string> }) => ({
    defaults: {
      baseURL: config?.baseURL,
      headers: config?.headers ?? {},
    },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  });

  return {
    __esModule: true,
    default: { create: jest.fn(createInstance) },
    isAxiosError: (error: unknown): boolean =>
      typeof error === "object" &&
      error !== null &&
      (error as { isAxiosError?: boolean }).isAxiosError === true,
  };
});

import api, { API_BASE_URL, handleApiError } from "./api";

describe("api client", () => {
  it("define a API_BASE_URL terminando em /api/v1", () => {
    expect(typeof API_BASE_URL).toBe("string");
    expect(API_BASE_URL.endsWith("/api/v1")).toBe(true);
  });

  it("cria uma instância axios com a baseURL e Content-Type esperados", () => {
    expect(api).toBeDefined();
    expect(api.defaults.baseURL).toBe(API_BASE_URL);
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  describe("handleApiError", () => {
    it("relança o response.data quando é um erro axios com response", () => {
      const axiosError = {
        isAxiosError: true,
        message: "Request failed",
        response: { data: { message: "campo inválido" } },
      };

      expect(() => handleApiError(axiosError)).toThrow();
      try {
        handleApiError(axiosError);
      } catch (thrown) {
        expect(thrown).toEqual({ message: "campo inválido" });
      }
    });

    it("preserva o status HTTP quando response.data não possui status", () => {
      const axiosError = {
        isAxiosError: true,
        message: "Request failed",
        response: {
          status: 404,
          data: { message: "Not found" },
        },
      };

      try {
        handleApiError(axiosError);
        throw new Error("não deveria chegar aqui");
      } catch (thrown) {
        expect(thrown).toEqual({
          message: "Not found",
          status: 404,
        });
      }
    });

    it("mantém statusCode fornecido pelo backend", () => {
      const axiosError = {
        isAxiosError: true,
        message: "Request failed",
        response: {
          status: 400,
          data: {
            message: "Bad request",
            statusCode: 400,
          },
        },
      };

      try {
        handleApiError(axiosError);
        throw new Error("não deveria chegar aqui");
      } catch (thrown) {
        expect(thrown).toEqual({
          message: "Bad request",
          statusCode: 400,
        });
      }
    });

    it("relança a message quando é um erro axios sem response", () => {
      const axiosError = {
        isAxiosError: true,
        message: "Network Error",
      };

      try {
        handleApiError(axiosError);
        throw new Error("não deveria chegar aqui");
      } catch (thrown) {
        expect(thrown).toBe("Network Error");
      }
    });

    it("relança o próprio erro quando não é um erro axios", () => {
      const error = new Error("erro genérico");

      expect(() => handleApiError(error)).toThrow(error);
    });
  });
});
