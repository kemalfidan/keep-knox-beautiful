import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  "roots": [
    "<rootDir>"
  ],
  "modulePaths": [
    "<rootDir>",
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.j(ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  // Setup Enzyme
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupFilesAfterEnv": ["<rootDir>/src/setupEnzyme.ts"],
};
export default config;


// module.exports = {
//   "roots": [
//     "<rootDir>"
//   ],
//   "modulePaths": [
//     "<rootDir>",
//   ],
//   "moduleDirectories": [
//     "node_modules"
//   ],
//   "testMatch": [
//     "**/__tests__/**/*.+(ts|tsx|js)",
//     "**/?(*.)+(spec|test).+(ts|tsx|js)"
//   ],
//   "transform": {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   },
//   // Setup Enzyme
//   "snapshotSerializers": ["enzyme-to-json/serializer"],
//   "setupFilesAfterEnv": ["<rootDir>/src/setupEnzyme.ts"],
// }
