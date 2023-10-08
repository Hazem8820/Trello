import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import userModel from './../../../../DB/models/user.model.js';
import tokenModel from './../../../../DB/models/token.model.js';
import cloudinary from './../../../utils/cloudinary.js';
import requestQr from "../../../utils/qrcode.js";
import bcrypt from 'bcryptjs';

//////////////////////////////////////////////////////////////////// Get User /////////////////////////////////////////////////////////////////////////////////////
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.query.id) 
    const qrcode = await requestQr({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email } }) // generate QRCode
    return user ? res.status(200).json({ success: true, user: req.user, qrcode }) : next(new Error("In-Valid User Id"))
})
//////////////////////////////////////////////////////////////////// Update User /////////////////////////////////////////////////////////////////////////////////////
export const updateUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, userName, email, phone, age } = req.body
    const user = await userModel.findByIdAndUpdate(req.user._id, { firstName, lastName, userName, email, phone, age }, { new: true })
    return user ? res.status(200).json({ success: true, user }) : next(new Error(`something went wrong please try again later ${req.user.firstName}`))
})
//////////////////////////////////////////////////////////////////// Delete User /////////////////////////////////////////////////////////////////////////////////////
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.query.id)
    return user ? res.status(200).json({ success: true, message: "user successfully deleted" }) : next(new Error(`something went wrong please try again later ${req.user.firstName}`))
})
//////////////////////////////////////////////////////////////////// Soft Delete /////////////////////////////////////////////////////////////////////////////////////
export const softDelete = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.query.id, { isDeleted: true })
    return user ? res.status(200).json({ success: true, message: "user successfully deleted" }) : next(new Error(`something went wrong please try again later ${req.user.firstName}`))
})
//////////////////////////////////////////////////////////////////// Upload Profile Picture /////////////////////////////////////////////////////////////////////////////////////
export const profilePic = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(new Error('Please Upload Pictures'), { cause: 400 })
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/users/${req.user._id}/profile` })
    const user = await userModel.findByIdAndUpdate(req.user._id, { profileImage: { url: secure_url, id: public_id } }, { new: true })
    if (!user) {
        await cloudinary.uploader.destroy(public_id)
        return res.status(404).json({ success: false, message: 'User Not Found' })
    }
    return res.status(200).json({ success: true, message: 'Picture Uploaded Successfully', user })
})
//////////////////////////////////////////////////////////////////// Upload Cover Pictures /////////////////////////////////////////////////////////////////////////////////////
export const coverPic = asyncHandler(async (req, res, next) => {
    const coverPics = []
    for (let i = 0; i < req.files.length; i++) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files[i].path, { folder: `e-commerce/users/${req.user._id}/cover` })
        coverPics.push({ url: secure_url, id: public_id })
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, { coverImages: coverPics }, { new: true })
    if (!user.coverImages.length) return next(new Error('Please Upload Some Pictures', { cause: 400 }))
    return res.status(200).json({ success: true, user })
})
//////////////////////////////////////////////////////////////////// Delete Cover /////////////////////////////////////////////////////////////////////////////////////
export const deleteCover = asyncHandler(async (req, res, next) => {
    const user = req.user
    if (user.coverImages) {
        for (const pic of user.coverImages) { await cloudinary.api.delete_resources(pic.id) }
    }
    user.coverImages = []
    await user.save()
    return res.status(200).json({ success: true, message: "Pictures have Successfully Removed", user: req.user })
})
//////////////////////////////////////////////////////////////////// Change Password /////////////////////////////////////////////////////////////////////////////////////
export const changePass = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body
    const match = bcrypt.compareSync(currentPassword, req.user.password)
    if (!match) return next(new Error('In_Valid Current Password', { cause: 400 }))
    const hashedPass = bcrypt.hashSync(newPassword, Number(process.env.SALT_ROUND))
    await userModel.findByIdAndUpdate(req.user._id, { password: hashedPass })
    return res.status(200).json({ success: true, message: "your password has successfully changed" })
})
//////////////////////////////////////////////////////////////////// Logout /////////////////////////////////////////////////////////////////////////////////////
export const logout = asyncHandler(async (req, res, next) => {
    await userModel.findByIdAndUpdate(req.user._id, { status: 'offline' })
    const tokens = await tokenModel.find({ user: req.user._id })
    tokens.forEach(async (token) => {
        token.isValid = false
        await token.save()
    })
    return res.status(200).json({ success: true, message: 'you have successfully logedout' })
})
