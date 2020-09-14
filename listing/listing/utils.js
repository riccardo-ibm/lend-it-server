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

module.exports.createErrorResponse = (errorCode, data) => {
    return module.exports.createHttpResponse(errorCode, { 'Content-Type': 'text/plain' }, data);
}

module.exports.extendListing = (listing) => {
    if (!listing.images || !listing.images.length) {
        listing.images = ['https://s3.amazonaws.com/lend-it.listing.images/no-image-placeholder.png'];
    }
    listing.mainImage = listing.images[0];
}