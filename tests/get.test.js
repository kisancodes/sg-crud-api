jest.mock('../src/utils/dynamodb');

const { send } = require('../src/utils/dynamodb');
const { handler } = require('../src/handlers/get');

describe('Get Item Lambda', () => {

  test('should get item successfully', async () => {
    const mockItem = {
      id: '123',
      name: 'Test Item'
    };

    dynamodb.send.mockResolvedValueOnce({ Item: mockItem });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    
    const item = JSON.parse(response.body);
    expect(item).toEqual(mockItem);
  });

  test('should return 404 when item not found', async () => {
    dynamodb.send.mockResolvedValueOnce({ Item: null });

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(404);
  });

  test('should return 500 on database error', async () => {
    send.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      pathParameters: { id: '123' }
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Could not fetch the item');
  });
});