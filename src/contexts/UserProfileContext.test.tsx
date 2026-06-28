import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import { Pressable, Text } from "react-native";

jest.mock("@/services/userProfile/userProfile.storage");
jest.mock("@/services/userMe/userMe.service");
jest.mock("@/contexts/AuthContext", () => ({
  useAuthSession: jest.fn(),
}));

import { useAuthSession } from "@/contexts/AuthContext";
import { userMeService } from "@/services/userMe/userMe.service";
import { getUserProfile, saveUserProfile } from "@/services/userProfile/userProfile.storage";
import { UserProfileProvider, useUserProfileContext } from "./UserProfileContext";

const mockGetUserProfile = getUserProfile as jest.Mock;
const mockSaveUserProfile = saveUserProfile as jest.Mock;
const mockGetMe = (userMeService as jest.Mocked<typeof userMeService>).getMe;
const mockUseAuthSession = useAuthSession as jest.Mock;
const mockUpdatePlanExpirationDate = jest.fn();

function Probe() {
  const { profilePictureUrl, updateProfilePicture } = useUserProfileContext();
  return (
    <>
      <Text testID="url">{profilePictureUrl ?? "null"}</Text>
      <Pressable
        testID="update"
        onPress={() => void updateProfilePicture("https://new.example.com/pic.jpg")}
      />
      <Pressable testID="clear" onPress={() => void updateProfilePicture(null)} />
    </>
  );
}

describe("UserProfileProvider", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockGetUserProfile.mockResolvedValue(null);
    mockSaveUserProfile.mockResolvedValue({});
    mockGetMe.mockRejectedValue(new Error("no token"));
    mockUseAuthSession.mockReturnValue({ updatePlanExpirationDate: mockUpdatePlanExpirationDate });
  });

  it("exibe null quando não há foto no AsyncStorage nem token", async () => {
    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("null");
    });
  });

  it("carrega profilePictureUrl do AsyncStorage ao montar", async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      profilePictureUrl: "https://cdn.example.com/old.jpg",
    });

    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/old.jpg");
    });
  });

  it("não chama a API quando não há token no AsyncStorage", async () => {
    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("null");
    });

    expect(mockGetMe).not.toHaveBeenCalled();
  });

  it("chama /users/me e atualiza a foto quando token existe", async () => {
    await AsyncStorage.setItem("token", "my-token");
    mockGetMe.mockResolvedValueOnce({
      plan_end_date: "2026-12-31",
      onboarding_completed: true,
      profile_picture_url: "https://cdn.example.com/fresh.jpg",
    });

    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/fresh.jpg");
    });

    expect(mockSaveUserProfile).toHaveBeenCalledWith({
      profilePictureUrl: "https://cdn.example.com/fresh.jpg",
    });
  });

  it("sincroniza planExpirationDate com AuthContext ao receber /users/me", async () => {
    await AsyncStorage.setItem("token", "my-token");
    mockGetMe.mockResolvedValueOnce({
      plan_end_date: "2026-12-31",
      onboarding_completed: true,
      profile_picture_url: null,
    });

    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(mockUpdatePlanExpirationDate).toHaveBeenCalledWith("2026-12-31");
    });
  });

  it("mantém cache quando /users/me falha", async () => {
    await AsyncStorage.setItem("token", "my-token");
    mockGetUserProfile.mockResolvedValueOnce({
      profilePictureUrl: "https://cdn.example.com/cached.jpg",
    });
    mockGetMe.mockRejectedValueOnce(new Error("Network error"));

    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/cached.jpg");
    });
  });

  it("updateProfilePicture atualiza estado imediatamente e persiste no storage", async () => {
    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => expect(screen.getByTestId("url")).toBeTruthy());

    await act(async () => {
      fireEvent.press(screen.getByTestId("update"));
    });

    expect(screen.getByTestId("url").props.children).toBe("https://new.example.com/pic.jpg");
    expect(mockSaveUserProfile).toHaveBeenCalledWith({
      profilePictureUrl: "https://new.example.com/pic.jpg",
    });
  });

  it("updateProfilePicture com null limpa a foto e persiste null", async () => {
    mockGetUserProfile.mockResolvedValueOnce({
      profilePictureUrl: "https://cdn.example.com/pic.jpg",
    });

    render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/pic.jpg");
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId("clear"));
    });

    expect(screen.getByTestId("url").props.children).toBe("null");
    expect(mockSaveUserProfile).toHaveBeenCalledWith({ profilePictureUrl: null });
  });

  it("recarrega a foto via /users/me quando a sessão muda (novo login)", async () => {
    await AsyncStorage.setItem("token", "token-user-1");
    mockUseAuthSession.mockReturnValue({
      updatePlanExpirationDate: mockUpdatePlanExpirationDate,
      sessionVersion: 1,
    });
    mockGetMe.mockResolvedValueOnce({
      plan_end_date: null,
      onboarding_completed: true,
      profile_picture_url: "https://cdn.example.com/user1.jpg",
    });

    const { rerender } = render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/user1.jpg");
    });

    await AsyncStorage.setItem("token", "token-user-2");
    mockGetMe.mockResolvedValueOnce({
      plan_end_date: null,
      onboarding_completed: true,
      profile_picture_url: "https://cdn.example.com/user2.jpg",
    });
    mockUseAuthSession.mockReturnValue({
      updatePlanExpirationDate: mockUpdatePlanExpirationDate,
      sessionVersion: 2,
    });

    rerender(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/user2.jpg");
    });
  });

  it("limpa a foto ao deslogar (storage limpo + sessão muda)", async () => {
    await AsyncStorage.setItem("token", "token-user-1");
    mockGetUserProfile.mockResolvedValue({
      profilePictureUrl: "https://cdn.example.com/user1.jpg",
    });
    mockGetMe.mockResolvedValue({
      plan_end_date: null,
      onboarding_completed: true,
      profile_picture_url: "https://cdn.example.com/user1.jpg",
    });
    mockUseAuthSession.mockReturnValue({
      updatePlanExpirationDate: mockUpdatePlanExpirationDate,
      sessionVersion: 1,
    });

    const { rerender } = render(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("https://cdn.example.com/user1.jpg");
    });

    await AsyncStorage.removeItem("token");
    mockGetUserProfile.mockResolvedValue(null);
    mockUseAuthSession.mockReturnValue({
      updatePlanExpirationDate: mockUpdatePlanExpirationDate,
      sessionVersion: 2,
    });

    rerender(
      <UserProfileProvider>
        <Probe />
      </UserProfileProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("url").props.children).toBe("null");
    });
  });
});
