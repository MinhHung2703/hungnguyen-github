const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { createTokenUser, attackCookiesToResponse, checkPermissions } = require('../utils')

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password')
    if (!user) {
        throw new CustomError.BadRequestError(`No user with id: ${req.params.id}`)
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    const user = await User.findOne({ _id: req.user.userId })
    user.name = name;
    user.email = email;

    const tokenUser = createTokenUser(user)
    attackCookiesToResponse({ res, user: tokenUser })

    await user.save()

    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    const user = await User.findOne({ _id: req.user.userId })
    const isCorrectPassword = await user.comparePassword(oldPassword)
    if (!isCorrectPassword) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword;
    await user.save()
    res.status(StatusCodes.OK).json({ msg: `Success! Password Updated` })
}

// const updateUser = async (req, res) => {
//     const { email, name } = req.body;
//     if (!email || !name) {
//         throw new CustomError.BadRequestError('Please provide all values');
//     }
//     const user = await User.findOneAndUpdate(
//         { _id: req.user.userId },
//         { email, name },
//         { new: true, runValidators: true }
//     );
//     const tokenUser = createTokenUser(user);
//     attackCookiesToResponse({ res, user: tokenUser })
//     res.status(StatusCodes.OK).json({ user: tokenUser })
// }

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}