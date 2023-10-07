import * as BC from "./controller/brands.controller.js"
import { validation } from "../../middleware/validation.js";
import { createbrandValidation, deletebrandValidation, updatebrandValidation } from "./brands.validation.js";
import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from './../../middleware/authorization.js';
import { fileUpload, extensionValidation } from '../../utils/multer.cloud.js'
import { Router } from "express";
const router = Router()
router.post('/create', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single('image'), validation(createbrandValidation), BC.createBrand)
router.put('/update', isAuthenticated, isAuthorized('admin'), fileUpload(extensionValidation.image).single('image'), validation(updatebrandValidation), BC.updateBrand)
router.delete('/delete', isAuthenticated, isAuthorized('admin'), validation(deletebrandValidation), BC.deleteBrand)
router.get('/getall', BC.getBrands)
router.get('/get/:id', validation(deletebrandValidation), BC.getBrandsById)

export default router 