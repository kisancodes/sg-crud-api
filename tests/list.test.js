const { handler } = require('../src/handlers/list');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) }
  };
});

describe('List Items Lambda', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    process.env.DYNAMODB_TABLE = 'test-table';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should list items successfully', async () => {
    const mockItems = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];

    documentClient.promise.mockResolvedValueOnce({ Items: mockItems });

    const response = await handler({});

    expect(response.statusCode).toBe(200);
    expect(documentClient.scan).toHaveBeenCalled();
    
    const items = JSON.parse(response.body);
    expect(items).toEqual(mockItems);
  });

  test('should return 500 on database error', async () => {
    documentClient.promise.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({});

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not fetch the items');
  });
});