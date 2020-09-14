'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const { createSuccessResponse, createErrorResponse } = require('./utils');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    if (typeof data.name !== 'string' || typeof data.description !== 'string' || typeof data.price !== 'number') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the listing.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: uuid.v1(),
            name: data.name,
            description: data.description,
            price: data.price,
            images: data.images,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, createErrorResponse(error.statusCode || 501, 'Couldn\'t create the listing.'));
            return;
        }

        const response = createSuccessResponse(params.Item);
        callback(null, response);
    });
};
