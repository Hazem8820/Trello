import Joi from "joi";
import { globalValidation } from './../../middleware/validation.js';

export const createProductValidation = Joi.object({
    name: globalValidation.firstName,
    description: globalValidation.description,
    availableItems: globalValidation.availableItems,
    soldItems: globalValidation.soldItems,
    price: globalValidation.price,
    discount: globalValidation.discount,
    categoryId: globalValidation._id,
    subCategoryId: globalValidation._id,
    brandId: globalValidation._id,
}).required()
export const updateProductValidation = Joi.object({
    name: globalValidation.firstName,
    description: globalValidation.description,
    availableItems: globalValidation.availableItems,
    price: globalValidation.price,
    discount: globalValidation.discount,
    id: globalValidation._id,
    categoryId: globalValidation._id,
    subCategoryId: globalValidation._id,
    brandId: globalValidation._id,
}).required()
export const deleteProductValidation = Joi.object({
    id: globalValidation._id
}).required()
export const searchByNameValidation = Joi.object({
    keyword: globalValidation.firstName
}).required()