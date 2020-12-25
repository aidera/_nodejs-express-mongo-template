const express = require('express');

const ProductsController = require('../controllers/shop.controller');
const ShopValidator = require('../services/validation/shop.validator');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', ProductsController.getProducts);
router.get('/all', ProductsController.getAllProducts);
router.get('/:productId', ProductsController.getProduct);
router.put('/', isAuth, ShopValidator.addProduct, ProductsController.addProduct);
router.patch('/:productId', isAuth, ShopValidator.editProduct, ProductsController.editProduct);
router.delete('/:productId', isAuth, ProductsController.removeProduct);

module.exports = router;
