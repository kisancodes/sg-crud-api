'use strict';

const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const uuid = require('uuid');
const { send } = require('../utils/dynamodb');

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
      Item: {
        id: uuid.v4(),
        name: data.name,
        description: data.description,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    await send(new PutCommand(params));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params.Item)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Could not create the item' })
    };
  }
};