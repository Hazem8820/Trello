import jwt from "jsonwebtoken"

const generateToken = (payload = {}, signature = process.env.DEFAULT_SIGNATURE, expiresIn = '1h') => {
    if (!Object.keys(payload).length) return next(new Error("In-Valid Payload", { cause: 400 }))
    const newtoken = jwt.sign(payload, signature, { expiresIn })
    return newtoken
}
export default generateToken