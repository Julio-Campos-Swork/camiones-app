const createErrorFactory = function (name) {
  return class InternalServerError extends Error {
    constructor(message, error) {
      super(message);
      this.name = name;
      this.message = message;
      this.error = error;
    }
  };
};

export const ServerError = createErrorFactory("ServerError");
