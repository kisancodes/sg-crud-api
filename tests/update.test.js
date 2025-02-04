const { handler } = require('../src/handlers/update');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    update: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mDocumentClient) }
  };
});

describe('Update Item Lambda', () => {
  let documentClient;

  beforeEach(() => {
    documentClient = new AWS.DynamoDB.DocumentClient();
    // Environment variables are set in jest.setup.js
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update item successfully', async () => {
    const updatedItem = {
      id: '123',
      name: 'Updated Item',
      description: 'Updated Description'
    };

    documentClient.promise.mockResolvedValueOnce({ Attributes: updatedItem });

    const response = await handler({
      pathParameters: { id: '123' },
      body: JSON.stringify({
        name: 'Updated Item',
        description: 'Updated Description'
      })
    });

    expect(response.statusCode).toBe(200);
    expect(documentClient.update).toHaveBeenCalled();
    
    const item = JSON.parse(response.body);
    expect(item).toEqual(updatedItem);
  });

  test('should return 400 when name is missing', async () => {
    const response = await handler({
      pathParameters: { id: '123' },
      body: JSON.stringify({
        description: 'Updated Description'
      })
    });

    expect(response.statusCode).toBe(400);
    expect(documentClient.update).not.toHaveBeenCalled();
  });

  test('should return 500 on database error', async () => {
    documentClient.promise.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' },
      body: JSON.stringify({
        name: 'Updated Item',
        description: 'Updated Description'
      })
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not update the item');
  });
});