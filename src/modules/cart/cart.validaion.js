import Joi from "joi";
import { globalValidation } from "../../middleware/validation.js";

export const cartValidationSchema = Joi.object({
    productId: globalValidation._id,
    quantity: globalValidation.quantity
}).required()
export const removeCartValidationSchema = Joi.object({
    id: globalValidation._id
}).required()