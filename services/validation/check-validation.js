const {validationResult} = require("express-validator");

const errorHandler = require("../error-handler");
const responseCodes = require("../../utils/response-codes");

module.exports = (req) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errorHandler.throw({
      statusCode: 422,
      errorCode: responseCodes.validationFailed,
      validationErrors
    });
  }
};
