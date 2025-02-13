const { handler } = require('../src/handlers/list');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { mockClient } = require('aws-sdk-client-mock');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('List Items Lambda', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  test('should list items successfully', async () => {
    const mockItems = [
      { 
        id: '1', 
        name: 'Item 1',
        description: 'Description 1',
        createdAt: 1234567890,
        updatedAt: 1234567890
      },
      { 
        id: '2', 
        name: 'Item 2',
        description: 'Description 2',
        createdAt: 1234567891,
        updatedAt: 1234567891
      }
    ];

    ddbMock.on(ScanCommand).resolves({ Items: mockItems });

    const response = await handler({});

    expect(response.statusCode).toBe(200);
    expect(ddbMock.calls()).toHaveLength(1);
    
    const items = JSON.parse(response.body);
    expect(items).toEqual(mockItems);
  });

  test('should return 500 on database error', async () => {
    ddbMock.on(ScanCommand).rejects(new Error('Database error'));

    const response = await handler({});

    expect(response.statusCode).toBe(500);
    expect(response.body).toContain('Could not fetch the items');
  });
});