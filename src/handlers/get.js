'use strict';

const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDB = require('../utils/dynamodb');

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id
      }
    };

    const result = await dynamoDB.send(new GetCommand(params));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Item not found' })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Could not fetch the item' })
    };
  }
};