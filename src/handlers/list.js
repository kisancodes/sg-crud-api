'use strict';

const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoDB = require('../utils/dynamodb');

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE
    };

    const result = await dynamoDB.send(new ScanCommand(params));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Could not fetch the items' })
    };
  }
};