// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'], // Load environment variables before tests
  verbose: true,
  testMatch: ["**/tests/googleApi.test.js"]
};
