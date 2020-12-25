const { body } = require('express-validator');

const responseCodes = require('../../utils/response-codes');
const User = require('../../models/User');

const validators = {
  signUp: [
    body('email')
      .trim()
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isEmail().withMessage(responseCodes.incorrectEmail)
      .custom((value, { req }) => {
        return User.findOne({email: value})
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject(responseCodes.emailAlreadyExists)
            }
          })
      }),
    body('password')
      .trim()
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isString().withMessage(responseCodes.shouldBeAString)
      .isLength({min: 6}).withMessage(responseCodes.isTooFewCharacters),
    body('name')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isString().withMessage(responseCodes.shouldBeAString)
  ],
  signIn: [
    body('email')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isEmail().withMessage(responseCodes.incorrectEmail),
    body('password')
      .not().isEmpty().withMessage(responseCodes.isRequired)
      .isString().withMessage(responseCodes.shouldBeAString)
      .isLength({min: 6}).withMessage(responseCodes.isTooFewCharacters),
  ]
}

module.exports = validators;
