import Joi from "joi"
import { globalValidation } from './../../middleware/validation.js';

export const createbrandValidation = Joi.object({
    name: globalValidation.firstName
}).required()

export const updatebrandValidation = Joi.object({
    name: globalValidation.firstName,
    id: globalValidation._id
}).required()

export const deletebrandValidation = Joi.object({
    id: globalValidation._id
}).required()