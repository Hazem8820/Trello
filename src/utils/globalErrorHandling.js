export const asyncHandler = (fn) => {
    return (req, res, next) => {
        return fn(req, res, next).catch(err => { return next(new Error(err, { cause: 500 })) })
    }
}


export const globalErrorHandler = (error, req, res, next) => {
    return res.status(error.cause || 400).json({ errMsg: error.message, error: error.stack })
} 