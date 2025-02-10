// Set up environment variables
process.env.DYNAMODB_TABLE = 'test-table';
process.env.REGION = 'us-east-1';

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
});