const { handler } = require('../src/handlers/delete');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Delete Item Lambda', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('should delete item successfully', async () => {
    ddbMock.on(DeleteCommand).resolves({});

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(204);
    expect(ddbMock.calls()).toHaveLength(1);
  });

  test('should return 500 on database error', async () => {
    ddbMock.on(DeleteCommand).rejects(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not delete the item');
  });
});