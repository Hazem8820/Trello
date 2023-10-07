import Joi from 'joi'
import { globalValidation } from '../../middleware/validation.js'

export const updateUserValidation = Joi.object({
    firstName: globalValidation.firstName,
    lastName: globalValidation.lastName,
    userName: globalValidation.userName,
    email: globalValidation.email,
    phone: globalValidation.phone,
    age: globalValidation.age
}).required()

export const deleteUserValidation = Joi.object({
    id: globalValidation._id
}).required()

export const changePasswordValidation = Joi.object({
    currentPassword: globalValidation.password,
    newPassword: globalValidation.password,
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
}).required()