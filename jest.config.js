module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    ".*assets/icons/lock\\.svg$": "<rootDir>/test/mocks/svgMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "\\.config\\.(js|ts)$",
    "/\\.expo/",
    "/app/_layout\\.tsx$",
  ],
};
