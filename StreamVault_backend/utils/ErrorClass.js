class AppError extends Error {
  /**
   * @param {number} status - HTTP status code
   * @param {string} message - Error message
   * @param {string} [code] - Optional application error code
   * @param {object} [details] - Optional additional error context
   */
  constructor(status, message, code = 'UNKNOWN_ERROR', details = {}) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

export default AppError;

// throw new AppError(400, 'Bad Request');



// {
//   "success": false,
//   "status": 404,
//   "message": "User not found",
//   "data": null,
//   "meta": {
//     "code": "USER_NOT_FOUND",
//     "details": {
//       "userId": 123
//     }
//   },
//   "timestamp": "2025-08-31T12:00:00.000Z"
// }
