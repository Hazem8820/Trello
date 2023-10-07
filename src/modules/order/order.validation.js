import Joi from 'joi';
import { globalValidation } from '../../middleware/validation.js';

export const createOrderValidation = Joi.object({
    address: globalValidation.address,
    coupon: globalValidation.coupon,
    phone: globalValidation.phone,
    payment: globalValidation.payment
}).required()

export const cancelOrderValidation = Joi.object({
    id: globalValidation._id
}).required()