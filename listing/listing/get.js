'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { createErrorResponse, createSuccessResponse } = require('./utils');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    // fetch todo from the database
    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, createErrorResponse(error.statusCode || 501, `Couldn't fetch the listing`))
            return;
        }

        // create a response
        const response = createSuccessResponse(result.Item);
        callback(null, response);
    });
};
