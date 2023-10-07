import * as CC from "./controller/category.controller.js"
import { validation } from "../../middleware/validation.js";
import { createCategoryValidation, deleteCategoryValidation, updateCategoryValidation } from "./category.validation.js";
import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from './../../middleware/authorization.js';
import { fileUpload, extensionValidation } from '../../utils/multer.cloud.js'
import subCategoryRouter from '../subcategory/subcategory.router.js'
import { Router } from "express";
const router = Router()
router.use('/:categoryId/subcategory', subCategoryRouter)
router.post('/create', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single('image'), validation(createCategoryValidation), CC.createCategory)
router.put('/update', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single('image'), validation(updateCategoryValidation), CC.updateCategory)
router.delete('/delete', isAuthenticated, isAuthorized('admin'), validation(deleteCategoryValidation), CC.deleteCategory)
router.get('/getall', CC.getCategory)
router.get('/get/:id', validation(deleteCategoryValidation), CC.getCategoryId)

export default router 