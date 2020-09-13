module.exports.createHttpResponse = (statusCode, headers, data) => {
    headers = headers || {};
    Object.assign(headers, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    })
    return {
        statusCode: statusCode,
        headers: headers,
        body: JSON.stringify(data),
    }
}

module.exports.createSuccessResponse = (data) => {
    return module.exports.createHttpResponse(200, {}, data);
}