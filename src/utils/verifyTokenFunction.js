import jwt from "jsonwebtoken"

const verifyToken = (token = "", signature = process.env.DEFAULT_SIGNATURE) => {
    if (!token || !String(token)) return next(new Error("Token is Required", { cause: 400 }))
    const newtoken = jwt.verify(token, signature)
    return newtoken
}
export default verifyToken