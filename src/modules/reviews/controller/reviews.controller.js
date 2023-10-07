import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import productModel from './../../../../DB/models/product.model.js';
import reviewModel from '../../../../DB/models/reviews.model.js';

//////////////////////////////////////////////////////////////////// create Review /////////////////////////////////////////////////////////////////////////////////////
export const createReview = asyncHandler(async (req, res, next) => {
    const { productId, content } = req.body
    const product = await productModel.findById(productId)
    if (!product) return next(new Error("In_Valid Product ID")) // check Product
    const review = await reviewModel.create({ user: req.user._id, content }) // create review
    await productModel.findByIdAndUpdate(productId, { $push: { reviews: { id: review._id } } }) // edit Product's Review
    return res.status(200).json({ success: true, message: "Your Review Successfully Added" })
})
//////////////////////////////////////////////////////////////////// Update Review /////////////////////////////////////////////////////////////////////////////////////
export const updateReview = asyncHandler(async (req, res, next) => {
    const { reviewId, content } = req.body
    const review = await reviewModel.findByIdAndUpdate(reviewId, { content })
    if (!review) return next(new Error("In_Valid Review ID")) // check & update Product
    return res.status(200).json({ success: true, message: "Your Review Successfully Updated" })
})
//////////////////////////////////////////////////////////////////// Delete Review /////////////////////////////////////////////////////////////////////////////////////
export const deleteReview = asyncHandler(async (req, res, next) => {
    const review = await reviewModel.findByIdAndDelete(req.query.id)
    if (!review) return next(new Error("In_Valid Review ID"))
    return res.status(200).json({ success: true, message: "Your Review Successfully Deleted" })
})
//////////////////////////////////////////////////////////////////// Get All Reviews /////////////////////////////////////////////////////////////////////////////////////
export const getAll = asyncHandler(async (req, res, next) => {
    const reviews = await reviewModel.find()
    return res.status(200).json({ success: true, reviews })
})