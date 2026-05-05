import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

const mockReplace = jest.fn();
const mockUpdateSession = jest.fn();
const mockSubscribe = jest.fn();

jest.mock("expo-router", () => {
  const replace = jest.fn();
  return { useRouter: () => ({ replace }) };
});

jest.mock("@/hooks/useAuth", () => {
  const updateSession = jest.fn().mockResolvedValue(undefined);
  return { useAuth: () => ({ updateSession }) };
});

jest.mock("@/services/subscription.service", () => {
  const subscribe = jest.fn();
  return { subscriptionService: { subscribe } };
});

import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionService } from "@/services/subscription.service";
import PlanosScreen from "../app/plans";

const MOCK_SUCCESS_RESPONSE = {
  success: true,
  data: {
    planActive: true,
    planExpirationDate: "2026-07-18",
    token: "new_access_token",
    refreshToken: "new_refresh_token",
  },
};

describe("PlanosScreen", () => {
  const subscribe = subscriptionService.subscribe as jest.Mock;
  const { updateSession } = useAuth();
  const updateSessionMock = updateSession as jest.Mock;
  const { replace } = useRouter();
  const replaceMock = replace as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    updateSessionMock.mockResolvedValue(undefined);
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve renderizar o carrosel de planos", () => {
    const { getByTestId } = render(<PlanosScreen />);
    expect(getByTestId("plans-carousel")).toBeTruthy();
  });

  it("deve renderizar o botão 'Assinar agora'", () => {
    const { getByTestId } = render(<PlanosScreen />);
    expect(getByTestId("subscribe-button")).toBeTruthy();
  });

  it("deve mostrar o título da tela", () => {
    const { getByText } = render(<PlanosScreen />);
    expect(getByText("Planos")).toBeTruthy();
  });

  it("deve mostrar o subtítulo da tela", () => {
    const { getByText } = render(<PlanosScreen />);
    expect(getByText("Selecione o plano de sua preferência")).toBeTruthy();
  });

  it("deve mostrar o título do plano trimestral", () => {
    const { getByText } = render(<PlanosScreen />);
    expect(getByText("Plano Trimestral")).toBeTruthy();
  });

  it("deve mostrar features do plano", () => {
    const { getAllByText } = render(<PlanosScreen />);
    expect(getAllByText("Simulados").length).toBeGreaterThan(0);
  });

  it("deve mostrar bolha da mascote", () => {
    const { getByText } = render(<PlanosScreen />);
    expect(getByText("O Estu recomenda o plano anual!")).toBeTruthy();
  });

  it("deve ter TRIMESTRAL como plano padrão (índice 0)", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(subscribe).toHaveBeenCalledWith({ planType: "TRIMESTRAL" });
  });

  it("deve selecionar ANUAL ao fazer scroll no carousel", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    fireEvent(getByTestId("plans-carousel"), "viewableItemsChanged", {
      viewableItems: [{ index: 1 }],
    });

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(subscribe).toHaveBeenCalledWith({ planType: "ANUAL" });
  });

  it("deve chamar subscriptionService.subscribe ao clicar em Liberar Acesso", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(subscribe).toHaveBeenCalledTimes(1);
  });

  it("deve enviar planType TRIMESTRAL por padrão", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(subscribe).toHaveBeenCalledWith({ planType: "TRIMESTRAL" });
  });

  it("planType enviado deve ser TRIMESTRAL ou ANUAL (enum válido)", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(["TRIMESTRAL", "ANUAL"]).toContain(subscribe.mock.calls[0][0].planType);
  });

  it("deve chamar updateSession com token, refreshToken e planExpirationDate", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(updateSessionMock).toHaveBeenCalledWith({
      token: "new_access_token",
      refreshToken: "new_refresh_token",
      planExpirationDate: "2026-07-18",
    });
  });

  it("deve atualizar planExpirationDate com o valor exato do backend", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(updateSessionMock.mock.calls[0][0].planExpirationDate).toBe("2026-07-18");
  });

  it("deve substituir access token pelo novo token da API", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(updateSessionMock.mock.calls[0][0].token).toBe("new_access_token");
  });

  it("deve substituir refreshToken pelo novo refreshToken da API", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(updateSessionMock.mock.calls[0][0].refreshToken).toBe("new_refresh_token");
  });

  it("deve redirecionar para '/' após sucesso", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(replaceMock).toHaveBeenCalledWith("/");
  });

  it("deve chamar updateSession antes do redirect (tokens persistidos antes do acesso)", async () => {
    const callOrder: string[] = [];
    updateSessionMock.mockImplementation(async () => {
      callOrder.push("updateSession");
    });
    replaceMock.mockImplementation(() => {
      callOrder.push("replace");
    });
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);

    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(callOrder).toEqual(["updateSession", "replace"]);
  });

  it("deve exibir mensagem de boas-vindas após ativação", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Bem-vindo!",
      expect.stringContaining("ativado com sucesso")
    );
  });

  it("deve exibir alerta com mensagem de erro da API", async () => {
    subscribe.mockRejectedValueOnce(new Error("Pagamento recusado"));
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Pagamento recusado");
  });

  it("deve usar fallback 'Erro ao ativar plano' quando erro sem .message", async () => {
    subscribe.mockRejectedValueOnce({ code: 500 });
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(Alert.alert).toHaveBeenCalledWith("Erro", "Erro ao ativar plano");
  });

  it("não deve redirecionar quando a requisição falha", async () => {
    subscribe.mockRejectedValueOnce(new Error("Erro de rede"));
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("não deve chamar updateSession quando a requisição falha", async () => {
    subscribe.mockRejectedValueOnce(new Error("Erro de rede"));
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(updateSessionMock).not.toHaveBeenCalled();
  });

  it("deve desabilitar o botão enquanto a requisição está em andamento", async () => {
    let resolve!: (v: unknown) => void;
    subscribe.mockReturnValueOnce(
      new Promise((r) => {
        resolve = r;
      })
    );

    const { getByTestId } = render(<PlanosScreen />);

    act(() => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    await waitFor(() => {
      expect(getByTestId("subscribe-button").props.accessibilityState.disabled).toBe(true);
    });

    await act(async () => {
      resolve(MOCK_SUCCESS_RESPONSE);
    });
  });

  it("deve reabilitar o botão após a requisição completar", async () => {
    subscribe.mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    const { getByTestId } = render(<PlanosScreen />);

    await act(async () => {
      fireEvent.press(getByTestId("subscribe-button"));
    });

    expect(getByTestId("subscribe-button").props.accessibilityState.disabled).toBe(false);
  });
});
