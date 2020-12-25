const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkValidation = require("../services/validation/check-validation");
const responseCodes = require("../utils/response-codes");
const errorHandler = require("../services/error-handler");

exports.signUp = async (req, res, next) => {
  checkValidation(req);

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    await user.save();

    const token = jwt.sign({
        email: result.email,
        userId: result._id.toString()
      },
      config.get("jwtSecret"),
      {expiresIn: config.get("tokenExpiresIn") / 3600000 + "h"}
    );

    res.status(201).json({
      message: "User created and you logged in",
      token: token,
      expiresIn: config.get("tokenExpiresIn")
    });

  } catch (err) {
    next(err);
  }

};

exports.login = async (req, res, next) => {
  checkValidation(req);

  const email = req.body.email;
  const password = req.body.password;


  try {
    const loadedUser = await User.findOne({email});
    if (!loadedUser) {
      errorHandler.throw({statusCode: 404, errorCode: responseCodes.emailOrPasswordIsNotCorrect});
    }
    const isPasswordsEqual = await bcrypt.compare(password, loadedUser.password);

    if (!isPasswordsEqual) {
      errorHandler.throw({statusCode: 404, errorCode: responseCodes.emailOrPasswordIsNotCorrect});
    }

    const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      config.get("jwtSecret"),
      {expiresIn: config.get("tokenExpiresIn") / 3600000 + "h"}
    );

    res.status(200).json({
      message: "You are logged in",
      token: token,
      expiresIn: config.get("tokenExpiresIn")
    });

  } catch (err) {
    next(err);
  }


};
