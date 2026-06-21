jest.mock("../../../../assets/placeholder_user.png", () => 1);

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/contexts/UserProfileContext", () => ({
  useUserProfileContext: jest.fn(),
}));

import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { ProfileAvatarButton } from "./ProfileAvatarButton";

const mockContext = useUserProfileContext as jest.Mock;

describe("ProfileAvatarButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza sem quebrar quando não há foto de perfil", () => {
    mockContext.mockReturnValue({ profilePictureUrl: null, updateProfilePicture: jest.fn() });

    const { toJSON } = render(<ProfileAvatarButton />);

    expect(toJSON()).toBeTruthy();
  });

  it("renderiza sem quebrar quando há URL de foto de perfil", () => {
    mockContext.mockReturnValue({
      profilePictureUrl: "https://cdn.example.com/avatar.jpg",
      updateProfilePicture: jest.fn(),
    });

    const { toJSON } = render(<ProfileAvatarButton />);

    expect(toJSON()).toBeTruthy();
  });

  it("navega para /profile ao pressionar o botão", () => {
    mockContext.mockReturnValue({ profilePictureUrl: null, updateProfilePicture: jest.fn() });

    render(<ProfileAvatarButton />);
    fireEvent.press(screen.getByRole("button"));

    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  it("navega para /profile mesmo quando há foto configurada", () => {
    mockContext.mockReturnValue({
      profilePictureUrl: "https://cdn.example.com/avatar.jpg",
      updateProfilePicture: jest.fn(),
    });

    render(<ProfileAvatarButton />);
    fireEvent.press(screen.getByRole("button"));

    expect(mockPush).toHaveBeenCalledWith("/profile");
  });
});
