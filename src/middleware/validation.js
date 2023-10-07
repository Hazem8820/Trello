import { Types } from "mongoose";
import Joi from "joi";

const idValidation = (value, helpers) => {
    return Types.ObjectId.isValid(value) ? true : helpers.message("In_Valid ID From Validation")
}

export const globalValidation = {
    firstName: Joi.string().min(5).max(20).required(),
    lastName: Joi.string().min(5).max(20).required(),
    userName: Joi.string().alphanum().min(5).max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().pattern((new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/))).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    phone: Joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)).required(),
    age: Joi.number().integer().positive().min(2).required(),
    gender: Joi.string().required(),
    code: Joi.string().length(5).required(),
    _id: Joi.string().custom(idValidation).required(),
    description: Joi.string().min(30).required(),
    availableItems: Joi.number().min(1).required(),
    soldItems: Joi.number().required(),
    price: Joi.number().min(2).required(),
    discount: Joi.number(),
    expireAt: Joi.date().greater(Date.now()).required(),
    quantity: Joi.number().integer().min(1).required(),
    address: Joi.string().min(10).max(100).required(),
    coupon: Joi.string().length(5).required(),
    payment: Joi.string().valid('Cash', 'Visa').required()
}

export const validation = (Schema) => {
    return (req, res, next) => {
        const validationResult = Schema.validate({ ...req.body, ...req.params, ...req.query }, { abortEarly: false })
        if (validationResult.error) return res.status(400).json({ message: "Validation Error", validationErr: validationResult.error.message })
        return next()
    }
}

