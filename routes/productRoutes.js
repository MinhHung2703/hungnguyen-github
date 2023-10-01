const express = require('express')
const router = express.Router()
const {
    authenticateUsers,
    authorizePermission
} = require('../middlewares/authentication')

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewController')

router
    .route('/')
    .post([authenticateUsers, authorizePermission('admin')], createProduct)
    .get(getAllProducts);

router
    .route('/uploadImage')
    .post([authenticateUsers, authorizePermission('admin')], uploadImage)

router
    .route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUsers, authorizePermission('admin')], updateProduct)
    .delete([authenticateUsers, authorizePermission('admin')], deleteProduct);

router
    .route('/:id/reviews')
    .get(getSingleProductReviews)

module.exports = router