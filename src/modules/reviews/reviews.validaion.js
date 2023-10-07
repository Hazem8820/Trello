import Joi from "joi";
import { globalValidation } from "../../middleware/validation.js";

export const createReviewValidation = Joi.object({
    productId: globalValidation._id,
    content: globalValidation.description
}).required()
export const updateReviewValidation = Joi.object({
    reviewId: globalValidation._id,
    content: globalValidation.description
}).required()
export const deleteReviewValidation = Joi.object({
    id: globalValidation._id
}).required()