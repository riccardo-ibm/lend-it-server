'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // validation
    if (typeof data.name !== 'string' || typeof data.description !== 'string' || typeof data.price !== 'number') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t update the listing item.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#listing_name': 'name',
        },
        ExpressionAttributeValues: {
            ':name': data.name,
            ':description': data.description,
            ':price': data.price,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #listing_name = :name, description = :description, price = :price, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    // update the todo in the database
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t fetch the listing item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};
