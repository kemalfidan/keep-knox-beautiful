import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.(ts|tsx)$": "babel-jest",
  },
  // Setup Enzyme
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFilesAfterEnv: ["<rootDir>/src/setupEnzyme.ts"],
};

export default config;
