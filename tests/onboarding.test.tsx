import AsyncStorage from "@react-native-async-storage/async-storage";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import { onboardingService } from "@/services/onboarding.service";
import OnboardingScreen from "../app/onboarding";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@/services/onboarding.service", () => ({
  onboardingService: {
    submit: jest.fn(),
  },
}));

function moveToGoalsStep(getByTestId: (testId: string) => any) {
  fireEvent.press(getByTestId("onboarding-primary-button"));
}

function fillGoalsStep(getByTestId: (testId: string) => any) {
  fireEvent.changeText(getByTestId("onboarding-preferred-language-input"), "Inglês");
  fireEvent.changeText(getByTestId("onboarding-desired-course-input"), "Computacao");
  fireEvent.changeText(getByTestId("onboarding-desired-university-input"), "UFRGS");
}

function moveToAvailabilityStep(getByTestId: (testId: string) => any) {
  moveToGoalsStep(getByTestId);
  fillGoalsStep(getByTestId);
  fireEvent.press(getByTestId("onboarding-primary-button"));
}

describe("OnboardingScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (onboardingService.submit as jest.Mock).mockReset();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza a tela inicial e mantém o botao Pular disponivel nas tres etapas", () => {
    const { getByText, getByTestId } = render(<OnboardingScreen />);

    expect(getByText("Ola, eu sou o Estu!")).toBeTruthy();
    expect(getByTestId("onboarding-skip-button")).toBeTruthy();

    fireEvent.press(getByTestId("onboarding-primary-button"));

    expect(getByText("Me conte suas metas e objetivos")).toBeTruthy();
    expect(getByTestId("onboarding-preferred-language-input")).toBeTruthy();
    expect(getByTestId("onboarding-skip-button")).toBeTruthy();

    fireEvent.press(getByTestId("onboarding-primary-button"));

    expect(getByText("Vamos organizar seus horários de estudo")).toBeTruthy();
    expect(getByTestId("onboarding-day-MONDAY")).toBeTruthy();
    expect(getByTestId("onboarding-skip-button")).toBeTruthy();
  });

  it("avanca para disponibilidade mesmo sem preencher metas", () => {
    const { getByTestId } = render(<OnboardingScreen />);

    moveToGoalsStep(getByTestId);
    fireEvent.press(getByTestId("onboarding-primary-button"));

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(getByTestId("onboarding-day-MONDAY")).toBeTruthy();
    expect(onboardingService.submit).not.toHaveBeenCalled();
  });

  it("permite concluir onboarding com payload vazio", async () => {
    (onboardingService.submit as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<OnboardingScreen />);

    fireEvent.press(getByTestId("onboarding-skip-button"));

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(onboardingService.submit).toHaveBeenCalledWith({});
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("hasCompletedOnboarding", "true");
    });

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/treinar");
  });

  it("redireciona para Treinar se o onboarding ja foi concluido", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    render(<OnboardingScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/treinar");
    });
  });

  it("envia apenas os horarios dos dias com selecao", async () => {
    (onboardingService.submit as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<OnboardingScreen />);

    moveToAvailabilityStep(getByTestId);

    fireEvent.press(getByTestId("onboarding-day-MONDAY"));
    fireEvent.press(getByTestId("onboarding-hour-18:00"));
    fireEvent.press(getByTestId("onboarding-day-WEDNESDAY"));

    fireEvent.press(getByTestId("onboarding-primary-button"));

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(onboardingService.submit).toHaveBeenCalledWith({
        desiredCourse: "Computacao",
        desiredUniversity: "UFRGS",
        preferredLanguage: "ENGLISH",
        studyHours: {
          MONDAY: [18],
        },
      });
    });

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/treinar");
  });

  it("envia o payload correto, marca onboarding concluido e redireciona para Treinar", async () => {
    (onboardingService.submit as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByTestId } = render(<OnboardingScreen />);

    moveToAvailabilityStep(getByTestId);

    fireEvent.press(getByTestId("onboarding-day-MONDAY"));
    fireEvent.press(getByTestId("onboarding-hour-19:00"));
    fireEvent.press(getByTestId("onboarding-hour-18:00"));

    fireEvent.press(getByTestId("onboarding-day-WEDNESDAY"));
    fireEvent.press(getByTestId("onboarding-hour-20:00"));

    fireEvent.press(getByTestId("onboarding-primary-button"));

    await waitFor(() => {
      expect(onboardingService.submit).toHaveBeenCalledWith({
        desiredCourse: "Computacao",
        desiredUniversity: "UFRGS",
        preferredLanguage: "ENGLISH",
        studyHours: {
          MONDAY: [18, 19],
          WEDNESDAY: [20],
        },
      });
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("hasCompletedOnboarding", "true");
    });

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)/treinar");
  });

  it("mostra mensagem de erro retornada pela API", async () => {
    (onboardingService.submit as jest.Mock).mockRejectedValueOnce({
      message: "Falha ao salvar onboarding",
    });

    const { getByTestId } = render(<OnboardingScreen />);

    moveToAvailabilityStep(getByTestId);

    fireEvent.press(getByTestId("onboarding-day-MONDAY"));
    fireEvent.press(getByTestId("onboarding-hour-18:00"));

    fireEvent.press(getByTestId("onboarding-primary-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erro", {
        message: "Falha ao salvar onboarding",
      });
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("nao permite envio duplicado", async () => {
    const pendingRequest = new Promise<void>(() => {
      // promise pendente para manter estado de submit em andamento
    });

    (onboardingService.submit as jest.Mock).mockReturnValueOnce(pendingRequest);

    const { getByTestId } = render(<OnboardingScreen />);

    moveToAvailabilityStep(getByTestId);

    fireEvent.press(getByTestId("onboarding-day-MONDAY"));
    fireEvent.press(getByTestId("onboarding-hour-18:00"));

    const submitButton = getByTestId("onboarding-primary-button");

    fireEvent.press(submitButton);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onboardingService.submit).toHaveBeenCalledTimes(1);
    });
  });
});
