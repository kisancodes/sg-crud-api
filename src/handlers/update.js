'use strict';

const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDB = require('../utils/dynamodb');

module.exports.handler = async (event) => {
  try {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    if (!data.name) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Name is required' })
      };
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id
      },
      ExpressionAttributeNames: {
        '#item_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': data.name,
        ':description': data.description,
        ':updatedAt': timestamp,
      },
      UpdateExpression: 'SET #item_name = :name, description = :description, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Could not update the item' })
    };
  }
};