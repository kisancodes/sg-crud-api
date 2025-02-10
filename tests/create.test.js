jest.mock('../src/utils/dynamodb');

const { send } = require('../src/utils/dynamodb');
const { handler } = require('../src/handlers/create');

describe('Create Item Lambda', () => {

  test('should create an item successfully', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    send.mockResolvedValueOnce({});

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(201);
    expect(send).toHaveBeenCalledTimes(1);
    
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
    expect(send).not.toHaveBeenCalled();
  });

  test('should return 500 on database error', async () => {
    const item = {
      name: 'Test Item',
      description: 'Test Description'
    };

    send.mockRejectedValueOnce(new Error('Database error'));

    const response = await handler({
      body: JSON.stringify(item)
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Could not create the item');
  });
});