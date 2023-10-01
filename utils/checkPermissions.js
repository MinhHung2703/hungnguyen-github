const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    // if role === admin, it will pass
    // if admin's role = admin's id, it will pass
    // on the other hands, it throw error 
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizedError('Not authorized to acces this route')
}

module.exports = checkPermissions