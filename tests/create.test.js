const { handler } = require('../src/handlers/create');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) }
  };
});

describe('Create Item Lambda', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    // Environment variables are set in jest.setup.js
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create an item successfully', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    documentClient.promise.mockResolvedValueOnce({});

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(201);
    expect(documentClient.put).toHaveBeenCalled();
    
    const parsedBody = JSON.parse(response.body);
    expect(parsedBody.name).toBe(item.name);
    expect(parsedBody.description).toBe(item.description);
    expect(parsedBody.id).toBeDefined();
  });

  test('should return 400 when name is missing', async () => {
    const item = {
      description: 'Test Description'
    };

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(400);
    expect(documentClient.put).not.toHaveBeenCalled();
  });

  test('should return 500 on database error', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    documentClient.promise.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not create the item');
  });
});