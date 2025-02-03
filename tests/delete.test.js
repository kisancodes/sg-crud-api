const { handler } = require('../src/handlers/delete');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    delete: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) }
  };
});

describe('Delete Item Lambda', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    process.env.DYNAMODB_TABLE = 'test-table';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should delete item successfully', async () => {
    documentClient.promise.mockResolvedValueOnce({});

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(204);
    expect(documentClient.delete).toHaveBeenCalled();
  });

  test('should return 500 on database error', async () => {
    documentClient.promise.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not delete the item');
  });
});