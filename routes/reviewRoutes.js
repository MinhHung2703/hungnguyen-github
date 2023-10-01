const express = require('express')
const router = express.Router()
const { authenticateUsers } = require('../middlewares/authentication')

const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')



router.route('/').post(authenticateUsers, createReview).get(getAllReviews)

router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUsers, updateReview)
    .delete(authenticateUsers, deleteReview)

module.exports = router