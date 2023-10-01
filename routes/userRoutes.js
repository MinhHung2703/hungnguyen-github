const express = require('express')
const router = express.Router()
const { authenticateUsers, authorizePermission } = require('../middlewares/authentication')
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
} = require('../controllers/userController')


router.route('/').get(authenticateUsers, authorizePermission('admin'), getAllUsers)
router.route('/showMe').get(showCurrentUser)
router.route('/updateUser').patch(authenticateUsers, updateUser)
router.route('/updateUserPassword').patch(authenticateUsers, updateUserPassword)

router.route('/:id').get(authenticateUsers, getSingleUser)

module.exports = router