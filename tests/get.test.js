const { handler } = require('../src/handlers/get');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Get Item Lambda', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('should get item successfully', async () => {
    const mockItem = {
      id: '123',
      name: 'Test Item',
      description: 'Test Description',
      createdAt: 1234567890,
      updatedAt: 1234567890
    };

    ddbMock.on(GetCommand).resolves({ Item: mockItem });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(200);
    expect(ddbMock.calls()).toHaveLength(1);
    
    const item = JSON.parse(response.body);
    expect(item).toEqual(mockItem);
  });

  test('should return 404 when item not found', async () => {
    ddbMock.on(GetCommand).resolves({ Item: null });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(404);
  });

  test('should return 500 on database error', async () => {
    ddbMock.on(GetCommand).rejects(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Could not fetch the item');
  });
});