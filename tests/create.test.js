const { handler } = require('../src/handlers/create');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Create Item Lambda', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('should create an item successfully', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    ddbMock.on(PutCommand).resolves({});

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(201);
    expect(ddbMock.calls()).toHaveLength(1);
    
    const parsedBody = JSON.parse(response.body);
    expect(parsedBody.name).toBe(item.name);
    expect(parsedBody.description).toBe(item.description);
    expect(parsedBody.id).toBeDefined();
    expect(parsedBody.createdAt).toEqual(expect.any(Number));
    expect(parsedBody.updatedAt).toEqual(expect.any(Number));
  });

  test('should return 400 when name is missing', async () => {
    const item = {
      description: 'Test Description'
    };

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(400);
    expect(ddbMock.calls()).toHaveLength(0);
  });

  test('should return 500 on database error', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    ddbMock.on(PutCommand).rejects(new Error('Database error'));

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Could not create the item');
  });
});