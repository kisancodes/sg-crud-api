const testConfig = require('./config/test.json');

// Set up test environment variables
process.env.DYNAMODB_TABLE = testConfig.DYNAMODB_TABLE;

// Clear all mocks and environment before each test
beforeEach(() => {
  jest.clearAllMocks();
});