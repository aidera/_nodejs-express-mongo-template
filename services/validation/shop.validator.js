const { body } = require('express-validator');

const responseCodes = require('../../utils/response-codes');

const validators = {
  addProduct: [
    body('title')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isLength({ min: 5 }).withMessage(responseCodes.isTooFewCharacters),
    body('price')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isDecimal().withMessage(responseCodes.shouldBeADecimalNumber),
    body('description')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isString().withMessage(responseCodes.shouldBeAString)
  ],
  editProduct: [
    body('title')
      .optional()
      .isLength({ min: 5 }).withMessage(responseCodes.isTooFewCharacters),
    body('price')
      .optional()
      .isDecimal().withMessage(responseCodes.shouldBeADecimalNumber),
    body('description')
      .optional()
      .isString().withMessage(responseCodes.shouldBeAString)
  ]
}

module.exports = validators;
