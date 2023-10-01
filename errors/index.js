const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const NotFound = require('./not-found')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./authorized')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFound,
    UnauthenticatedError,
    UnauthorizedError
}