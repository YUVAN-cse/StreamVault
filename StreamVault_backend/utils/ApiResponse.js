class APIResponse {
  /**
   * @param {number} status - HTTP status code
   * @param {string} message - Human-readable message
   * @param {object|null} data - The actual response data (if any)
   * @param {object|null} meta - Optional metadata (e.g. pagination info)
   */
  constructor(status, message, data = null, meta = null) {
    this.success = status >= 200 && status < 300;
    this.status = status;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    const res = {
      success: this.success,
      status: this.status,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp
    };
    if (this.meta) res.meta = this.meta;
    return res;
  }
}

export default APIResponse


// res
//   .status(200)
//   .json(new APIResponse(200, 'User profile fetched', { name: 'Alice' }));


// {
//   "success": true,
//   "status": 200,
//   "message": "User profile fetched",
//   "data": { "name": "Alice" },
//   "timestamp": "2025-08-31T12:00:00.000Z"
// }