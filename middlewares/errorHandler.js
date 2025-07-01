// Class for handling all the remaining unhandled errors
class errorHandler extends Error {
  constructor(message, statusCode) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error"
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = errorHandler
