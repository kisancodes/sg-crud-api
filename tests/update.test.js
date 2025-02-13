const { handler } = require('../src/handlers/update');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Update Item Lambda', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('should update item successfully', async () => {
    const updatedItem = {
      id: '123',
      name: 'Updated Item',
      description: 'Updated Description',
      updatedAt: expect.any(Number)
    };

    ddbMock.on(UpdateCommand).resolves({ Attributes: updatedItem });

    const response = await handler({
      pathParameters: { id: '123' },
      body: JSON.stringify({
        name: 'Updated Item',
        description: 'Updated Description'
      })
    });

    expect(response.statusCode).toBe(200);
    expect(ddbMock.calls()).toHaveLength(1);
    
    const item = JSON.parse(response.body);
    expect(item.id).toBe(updatedItem.id);
    expect(item.name).toBe(updatedItem.name);
    expect(item.description).toBe(updatedItem.description);
    expect(item.updatedAt).toEqual(expect.any(Number));
  });

  test('should return 400 when name is missing', async () => {
    const response = await handler({
      pathParameters: { id: '123' },
      body: JSON.stringify({
        description: 'Updated Description'
      })
    });

    expect(response.statusCode).toBe(400);
    expect(ddbMock.calls()).toHaveLength(0);
  });

  test('should return 500 on database error', async () => {
    ddbMock.on(UpdateCommand).rejects(new Error('Database error'));

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