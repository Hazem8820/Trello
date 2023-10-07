import Joi from "joi"
import { globalValidation } from './../../middleware/validation.js';

export const createCategoryValidation = Joi.object({
    name: globalValidation.firstName
}).required()

export const updateCategoryValidation = Joi.object({
    name: globalValidation.firstName,
    id: globalValidation._id
}).required()

export const deleteCategoryValidation = Joi.object({
    id: globalValidation._id
}).required()