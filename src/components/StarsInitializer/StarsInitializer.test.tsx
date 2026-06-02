import React from "react";
import { render } from "@testing-library/react-native";
import { StarsInitializer } from "@/components/StarsInitializer";
import { useInitializeStars } from "@/hooks/useInitializeStars";

jest.mock("@/hooks/useInitializeStars", () => ({
  useInitializeStars: jest.fn(),
}));

describe("StarsInitializer", () => {
  it("dispara a inicialização das stars ao renderizar", () => {
    render(<StarsInitializer />);

    expect(useInitializeStars).toHaveBeenCalledTimes(1);
  });
});
