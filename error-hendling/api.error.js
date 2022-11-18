export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static NotAcceptable(message, errors = []) {
    return new ApiError(406, message, errors);
  }
  static NotImplemented(message = "Hе реализовано", errors = []) {
    return new ApiError(501, message, errors);
  }
}
