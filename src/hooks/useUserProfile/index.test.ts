import { useUserProfile } from "./index";

describe("useUserProfile index", () => {
  it("re-exporta o hook useUserProfile", () => {
    expect(useUserProfile).toBeDefined();
    expect(typeof useUserProfile).toBe("function");
  });
});
