const coverageThreshold = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
};

module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "<rootDir>/src/**/?(*.)+(test|spec).(js|jsx|ts|tsx)",
    "<rootDir>/app/**/?(*.)+(test|spec).(js|jsx|ts|tsx)",
    "<rootDir>/tests/**/?(*.)+(test|spec).(js|jsx|ts|tsx)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/test/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    ".*assets/icons/lock\\.svg$": "<rootDir>/test/mocks/svgMock.js",
  },
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "src/services/**/*.{ts,tsx}",
    "src/utils/**/*.{ts,tsx}",
    "src/contexts/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/index.ts",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "\\.config\\.(js|ts)$",
    "/\\.expo/",
    "/app/_layout\\.tsx$",
    "/app/\\+not-found\\.tsx$",
    "/app/\\(tabs\\)/_layout\\.tsx$",
    // Legacy debt tracked in .github/coverage-legacy.txt
    "/app/\\(tabs\\)/cronograma\\.tsx$",
    "/app/\\(tabs\\)/treinar\\.tsx$",
    "/app/index\\.tsx$",
    "/app/intro\\.tsx$",
    "/app/paywall\\.tsx$",
    "/app/examHistory\\.tsx$",
    "/app/exam\\.tsx$",
    "/app/\\(tabs\\)/simulado\\.tsx$",
    "/app/new-password\\.tsx$",
    "/app/otp-verification\\.tsx$",
    "/app/password-recovery\\.tsx$",
    "/src/services/otp/otp\\.service\\.ts$",
    "/src/services/api/api\\.ts$",
  ],
  coverageReporters: ["text", "html", "json-summary"],
  coverageThreshold,
};
