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
      description: 'Updated Description'
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