import Joi from "joi"
import { globalValidation } from "../../middleware/validation.js"

export const createSubCategoryValidation = Joi.object({
    name: globalValidation.firstName,
    categoryId: globalValidation._id
}).required()

export const updateSubCategoryValidation = Joi.object({
    name: globalValidation.firstName,
    categoryId: globalValidation._id,
    subCategoryId: globalValidation._id
}).required()

export const deleteSubCategoryValidation = Joi.object({
    subCategoryId: globalValidation._id
}).required()

export const getSubCategoryValidation = Joi.object({
    id: globalValidation._id
}).required()