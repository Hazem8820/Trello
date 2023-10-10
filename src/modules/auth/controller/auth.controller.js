import bcrypt from 'bcryptjs'
import randomstring from "randomstring";
import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import generateToken from "../../../utils/signTokenFunction.js";
import sendEmail from './../../../utils/sendemail.js';
import verifyToken from './../../../utils/verifyTokenFunction.js';
import tokenModel from './../../../../DB/models/token.model.js';
import { confirmStamp, requestNewStamp, resetPassStamp } from '../../../utils/generateHTML.js';

//////////////////////////////////////////////////////////////////// Sign Up /////////////////////////////////////////////////////////////////////////////////////
export const Signup = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, userName, email, password, phone, age, gender } = req.body // user data
    const checkUser = await userModel.findOne({ email }) //check user
    if (checkUser) return next(new Error('Account Already Exist', { cause: 409 }))
    const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT_ROUND)) //hashpassword 
    const user = await userModel.create({ firstName, lastName, userName, email, password: hashedPassword, phone, age, gender }) //create user
    const token = generateToken({ id: user._id }, process.env.EMAIL_SIGNATURE, 60 * 5) //generate confirmation tokens
    const newToken = generateToken({ id: user._id }, process.env.EMAIL_SIGNATURE, 60 * 60 * 24 * 30)
    const html = confirmStamp(`${req.protocol}://${req.headers.host}/auth/confirmemail/${token}`, `${req.protocol}://${req.headers.host}/auth/newconfirmemail/${newToken}`)
    await sendEmail({ to: email, subject: "Account Activation", html: html }) // send email
    return res.status(201).json({ success: true, message: "check your mail inbox" }) // response
})
//////////////////////////////////////////////////////////////////// Confirm Email /////////////////////////////////////////////////////////////////////////////////////
export const confirmemail = asyncHandler(async (req, res, next) => {
    const decode = verifyToken(req.params.token, process.env.EMAIL_SIGNATURE) // verify Token
    const user = await userModel.findByIdAndUpdate(decode.id, { isConfirmed: true }) // update isConfirmed key
    return res.status(201).json({ success: true, result: 'you have activate your account successfully', message: `you can login now sir ${user.firstName}` })
})
//////////////////////////////////////////////////////////////////// Request New Confirm Message /////////////////////////////////////////////////////////////////////////////////////
export const newConfirmRequest = asyncHandler(async (req, res, next) => {
    const decode = verifyToken(req.params.token, process.env.EMAIL_SIGNATURE) // verify Token
    const user = await userModel.findById(decode.id)
    if (!user) return next(new Error("Account Not Found", { cause: 404 })) // check user
    if (user.isConfirmed) return res.status(201).json({ success: true, result: "you have activate your account successfully", message: `you can login now sir ${user.firstName}` }) // check Confirmation
    const token = generateToken({ id: user._id }, process.env.EMAIL_SIGNATURE, 60 * 2)
    const html = requestNewStamp(`${req.protocol}://${req.headers.host}/auth/confirmemail/${token}`) // generate token
    await sendEmail({ to: user.email, subject: "Account Activation", html }) // send new mail
    return res.status(201).json({ success: true, message: "check your mail inbox again" })
})
//////////////////////////////////////////////////////////////////// Sign In /////////////////////////////////////////////////////////////////////////////////////
export const Signin = asyncHandler(async (req, res, next) => {
    const checkUser = await userModel.findOne({ email: req.body.email })
    if (!checkUser) return next(new Error("Account is not Exist", { cause: 404 })) // check user
    const match = bcrypt.compareSync(req.body.password, checkUser.password)
    if (!match) return next(new Error("In-Correct Email or Password", { cause: 400 })) // check pass
    if (!checkUser.isConfirmed) res.status(400).json({ success: false, message: "Activate Your Account First Please" }) // check confirmation
    const token = generateToken({ id: checkUser._id }, process.env.TOKEN_SIGNATURE, '1d') // generate Token
    await tokenModel.create({ token, user: checkUser._id, agent: req.headers["user-agent"] }) // save token to db
    checkUser.status = 'online' // update status
    await checkUser.save()
    return res.status(201).json({ success: true, message: `welcome back ${checkUser.firstName} ${checkUser.lastName}`, token })
})
//////////////////////////////////////////////////////////////////// Request Code /////////////////////////////////////////////////////////////////////////////////////
export const resetPasswordEmail = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email }) // checkuser
    if (!user) return next(new Error("Account is not Exist", { cause: 404 }))
    const code = randomstring.generate({ length: 5, charset: 'numeric' }) // generate code 
    user.forgotCode = code // save code in DB
    await user.save()
    const html = resetPassStamp(code)
    sendEmail({ to: user.email, subject: 'Reset Password', html })
    return res.status(201).json({ success: true, message: "please check your inbox" })
})
//////////////////////////////////////////////////////////////////// Reset Password /////////////////////////////////////////////////////////////////////////////////////
export const resetPasswordCode = asyncHandler(async (req, res, next) => {
    const checkUser = await userModel.findOne({ forgotCode: req.body.code })
    if (!checkUser) return next(new Error('In-Valid Code', { cause: 400 })) // check user
    const tempPass = randomstring.generate({ length: 2, charset: 'string' }).toUpperCase() + ["!", "@", "#", "$", "%", "^", "&", "*"][Math.floor(Math.random() * 7)] + randomstring.generate({ length: 6, charset: 'numeric' }) // #validation generate password
    const hashedpass = bcrypt.hashSync(tempPass, Number(process.env.SALT_ROUND)) // hash password
    await userModel.findByIdAndUpdate(checkUser._id, { password: hashedpass, status: 'offline', $unset: { forgotCode: 1 } }) // update password
    const tokens = await tokenModel.find({ user: checkUser._id }) // logout from all devices
    tokens.forEach(async (token) => {
        token.isValid = false
        await token.save()
    })
    return res.status(201).json({ success: true, temporaryPass: tempPass })
})



