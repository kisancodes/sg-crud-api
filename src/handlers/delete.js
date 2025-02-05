'use strict';

const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDB = require('../utils/dynamodb');

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id
      }
    };

    await dynamoDB.send(new DeleteCommand(params));

    return {
      statusCode: 204,
      headers: { 'Content-Type': 'application/json' },
      body: ''
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Could not delete the item' })
    };
  }
};