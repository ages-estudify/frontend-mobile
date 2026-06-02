import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import SubjectBox from "./SubjectBox";

// Subject SVGs are not transformed under jest; stub each as a no-op component.
jest.mock("../../../assets/icons/subjects/biologia.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/espanhol.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/filosofia.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/fisica.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/geografia.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/historia.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/ingles.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/literatura.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/matematica.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/portugues.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/quimica.svg", () => () => null);
jest.mock("../../../assets/icons/subjects/sociologia.svg", () => () => null);

const mockNavigate = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
}));

describe("SubjectBox", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the subject label", () => {
    render(
      <SubjectBox
        subject="Física"
        icon="https://example.com/i.png"
        href="/subject?id=1&name=Física"
      />
    );

    expect(screen.getByText("Física")).toBeTruthy();
  });

  it("navigates to the given href when pressed", () => {
    const href = "/subject?id=abc&name=Química";

    render(<SubjectBox subject="Química" href={href} />);

    fireEvent.press(screen.getByText("Química"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(href);
  });
});
