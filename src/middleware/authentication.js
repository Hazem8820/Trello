import { asyncHandler } from '../utils/globalErrorHandling.js';
import verifyToken from './../utils/verifyTokenFunction.js';
import userModel from './../../DB/models/user.model.js';
import tokenModel from './../../DB/models/token.model.js';

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.headers
    if (!token?.startsWith(process.env.TOKEN_BEARER)) return next(new Error("token is required", { cause: 400 })) // check Bearer Token
    const splitedToken = token.split(process.env.TOKEN_BEARER)[1]
    if (!splitedToken) return next(new Error("In-Valid Token", { cause: 400 })) // check token
    const decode = verifyToken(splitedToken, process.env.TOKEN_SIGNATURE)
    if (!decode.id) return next(new Error("In-Valid Payload", { cause: 400 })) // check token payload
    const checkToken = await tokenModel.findOne({ user: decode.id, isValid: true })
    if (!checkToken) return next(new Error("Token Expired", { cause: 400 })) // check token's expire date
    const user = await userModel.findById(decode.id)
    if (!user) return next(new Error("User is Not Registered", { cause: 400 })) // check user
    req.user = user
    return next()
})

export default isAuthenticated