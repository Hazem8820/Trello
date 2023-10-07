const isAuthorized = (role) => {
    return (req, res, next) => {
        if (role !== req.user.role) return next(new Error('User is Not Authorized', { cause: 403 }))
        return next()
    }
}

export default isAuthorized