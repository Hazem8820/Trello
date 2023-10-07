import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import couponModel from './../../../../DB/models/coupon.model.js';
import voucher_codes from 'voucher-code-generator'

//////////////////////////////////////////////////////////////////// Generate Coupon /////////////////////////////////////////////////////////////////////////////////////
export const createCoupon = asyncHandler(async (req, res, next) => {
    const code = voucher_codes.generate({ length: 5 }) // Generate Coupon
    const codeDB = await couponModel.create({ name: code[0], discount: req.body.discount, expireAt: new Date(req.body.expireAt).getTime(), createdBy: req.user._id }) // create coupon
    return res.status(201).json({ success: true, code: codeDB })
})
//////////////////////////////////////////////////////////////////// Update Coupon /////////////////////////////////////////////////////////////////////////////////////
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findOne({ name: req.body.name, expireAt: { $gt: Date.now() } })
    if (!coupon) return next(new Error("Coupon Not Found", { cause: 400 })) // check coupon
    if (coupon.createdBy.toString() !== req.user._id.toString()) next(new Error("You are not Authorized", { cause: 403 })) // check createdBy
    const couponUp = await couponModel.findOneAndUpdate({ name: req.body.name, expireAt: { $gt: Date.now() } }, { discount: req.body.discount, expireAt: new Date(req.body.expireAt).getTime() }, { new: true })
    return res.status(200).json({ success: true, couponUp })
})
//////////////////////////////////////////////////////////////////// Delete Coupon /////////////////////////////////////////////////////////////////////////////////////
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.findById(req.query.id)
    if (!coupon) return next(new Error("Coupon Not Found", { cause: 400 })) // check coupon
    if (coupon.createdBy.toString() !== req.user._id.toString()) next(new Error("You are not Authorized", { cause: 403 })) // check createdBy
    await couponModel.findByIdAndDelete(req.query.id)
    return res.status(200).json({ success: true, message: "Coupon Deleted Successfully" })
})
//////////////////////////////////////////////////////////////////// Get All Coupon /////////////////////////////////////////////////////////////////////////////////////
export const getAll = asyncHandler(async (req, res, next) => {
    const allCoupons = await couponModel.find({})
    return res.status(200).json({ success: true, allCoupons })
})
//////////////////////////////////////////////////////////////////// Get Coupon By Id /////////////////////////////////////////////////////////////////////////////////////
export const getById = asyncHandler(async (req, res, next) => {
    const Coupon = await couponModel.findById(req.query.id)
    return res.status(200).json({ success: true, Coupon })
})