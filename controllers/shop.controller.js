const Product = require("../models/Product");
const User = require("../models/User");
const checkValidation = require("../services/validation/check-validation");
const errorHandler = require("../services/error-handler");
const responseCodes = require("../utils/response-codes");
const io = require('../utils/socket');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({products});
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 10;

  try {
    const totalProductsCount = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      products,
      totalProductsCount,
      totalPagesCount: Math.ceil(totalProductsCount / perPage),
      currentPage: currentPage,
      perPage: perPage,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (product === null) {
      errorHandler.throw({statusCode: 404, errorCode: responseCodes.productNotFound});
    } else {
      res.status(200).json({product});
    }
  } catch (err) {
    next(err);
  }

};

exports.addProduct = async (req, res, next) => {
  checkValidation(req);

  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title, price, description, creator: req.authUserId
  });

  try {
    await product.save();

    const user = await User.findById(req.authUserId);
    user.products.push(product);
    await user.save();

    io.get().emit('products', { action: 'add', product });

    res.status(201).json({
      message: "Product added",
      addedProduct: product,
    });
  } catch (err) {
    next(err);
  }

};

exports.editProduct = async (req, res, next) => {
  checkValidation(req);

  const productId = req.params.productId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;

  try {
    const product = await Product.findById(productId);
    if (product === null) {
      errorHandler.throw({statusCode: 404, errorCode: responseCodes.productNotFound});
    } else {
      if (title) product.title = title;
      if (price) product.price = price;
      if (description) product.description = description;

      await product.save();

      io.get().emit('products', { action: 'edit', product });

      res.status(200).json({
        message: "Product updated",
        updatedProduct: product,
      });
    }
  } catch (err) {
    next(err);
  }


};

exports.removeProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByIdAndRemove(productId);
    if (product === null) {
      errorHandler.throw({statusCode: 404, errorCode: responseCodes.productNotFound});
    }

    const user = await User.findById(product.creator);
    user.products.pull(productId);
    await user.save();

    io.get().emit('products', { action: 'remove', product });

    res.send({
      message: "Product removed",
      removedProduct: product,
    });
  } catch (err) {
    next(err);
  }

};
