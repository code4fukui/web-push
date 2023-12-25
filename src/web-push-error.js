class WebPushError extends Error {
  constructor(message, statusCode, headers, body, endpoint) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    this.endpoint = endpoint;
  }
};

export default WebPushError;
