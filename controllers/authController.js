const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attackCookiesToResponse, createTokenUser } = require('../utils')

const register = async (req, res) => {
    const { email, name, password } = req.body;
    const emailAlreadyExist = await User.findOne({ email })
    if (emailAlreadyExist) {
        throw new CustomError.BadRequestError('Email already exist');
    }
    // first resgistered user is admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user'

    const user = await User.create({ email, name, password, role });
    const tokenUser = createTokenUser(user)
    attackCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenUser = createTokenUser(user);
    attackCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out' });
}

module.exports = {
    register,
    login,
    logout
}