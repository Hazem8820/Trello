import Joi from "joi"
import { globalValidation } from "../../middleware/validation.js"

export const signUpValidation = Joi.object({
    firstName: globalValidation.firstName,
    lastName: globalValidation.lastName,
    userName: globalValidation.userName,
    email: globalValidation.email,
    password: globalValidation.password,
    confirmPassword: globalValidation.confirmPassword,
    phone: globalValidation.phone,
    age: globalValidation.age,
    gender: globalValidation.gender
}).required()

export const signInValidation = Joi.object({
    email: globalValidation.email,
    password: globalValidation.password,
}).required()

export const resetPasswordEmailValidation = Joi.object({
    email: globalValidation.email
}).required()

export const resetPasswordCodeValidation = Joi.object({
    code: globalValidation.code
}).required()
