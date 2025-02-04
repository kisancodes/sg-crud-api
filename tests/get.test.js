const { handler } = require('../src/handlers/get');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    get: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) }
  };
});

describe('Get Item Lambda', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    // Environment variables are set in jest.setup.js
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get item successfully', async () => {
    const mockItem = {
      id: '123',
      name: 'Test Item'
    };

    documentClient.promise.mockResolvedValueOnce({ Item: mockItem });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(200);
    expect(documentClient.get).toHaveBeenCalled();
    
    const item = JSON.parse(response.body);
    expect(item).toEqual(mockItem);
  });

  test('should return 404 when item not found', async () => {
    documentClient.promise.mockResolvedValueOnce({ Item: null });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(404);
  });

  test('should return 500 on database error', async () => {
    documentClient.promise.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not fetch the item');
  });
});