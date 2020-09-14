'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const FileType = require('file-type');
const { createSuccessResponse, createErrorResponse } = require('./utils');

const s3 = new AWS.S3();

module.exports.upload = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const imageBuffer = Buffer.from(data.base64Image, 'base64');
    FileType.fromBuffer(imageBuffer).then(res => {
        const fileName = `${uuid.v1()}.${res.ext}`;
        s3.putObject({
            Bucket: process.env.IMAGE_BUCKET,
            Key: fileName,
            Body: imageBuffer,
        }, (err, response) => {
            if (err) {
                callback(null, createErrorResponse(err.statusCode, `Couldn't upload the file`));
            }
            else {
                callback(null, createSuccessResponse({
                    fileId: fileName
                }))
            }
        });
    }, err => {
        callback(null, createErrorResponse(err.statusCode, `An error has occurred while determining the file type`));
    })

}
