import Joi from "joi";
import { globalValidation } from './../../middleware/validation.js';

export const createCouponValidaion = Joi.object({
    discount: globalValidation.discount,
    expireAt: globalValidation.expireAt
}).required()
export const updateCouponValidation = Joi.object({
    name: globalValidation.firstName,
    discount: globalValidation.discount,
    expireAt: globalValidation.expireAt
}).required()
export const deleteCouponValidation = Joi.object({
    id: globalValidation._id
}).required()