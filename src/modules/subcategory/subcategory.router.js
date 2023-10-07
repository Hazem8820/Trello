import { validation } from '../../middleware/validation.js'
import * as SC from "./controller/subcategory.controller.js"
import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from './../../middleware/authorization.js';
import { fileUpload, extensionValidation } from '../../utils/multer.cloud.js'
import { createSubCategoryValidation, deleteSubCategoryValidation, getSubCategoryValidation, updateSubCategoryValidation } from "./subcategory.validations.js";
import { Router } from "express";
const router = Router({ mergeParams: true })

router.post('/create', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single("image"), validation(createSubCategoryValidation), SC.createSubCategory)
router.put('/update/:subCategoryId', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single("image"), validation(updateSubCategoryValidation), SC.updateSubCategory)
router.delete('/delete/:subCategoryId', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single("image"), validation(deleteSubCategoryValidation), SC.deleteSubCategory)
router.get('/getall', SC.getSubCategory)
router.get('/get/:id', validation(getSubCategoryValidation), SC.getSubCategoryId)


export default router 