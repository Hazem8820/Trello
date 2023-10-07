import { Router } from "express"
import * as PC from './controller/product.controller.js'
import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from './../../middleware/authorization.js';
import { fileUpload, extensionValidation } from './../../utils/multer.cloud.js'
import { validation } from "../../middleware/validation.js";
import { createProductValidation, deleteProductValidation, searchByNameValidation, updateProductValidation } from "./product.validation.js";
const router = Router()

router.post('/create',
    isAuthenticated,
    isAuthorized('admin'),
    fileUpload(extensionValidation.image).fields([{ name: 'Images', maxCount: 3 }, { name: 'defaultImage', maxCount: 1 }]),
    validation(createProductValidation),
    PC.createProduct)
router.put('/update',
    isAuthenticated,
    isAuthorized('admin'),
    fileUpload(extensionValidation.image).fields([{ name: 'Images', maxCount: 3 }, { name: 'defaultImage', maxCount: 1 }]),
    validation(updateProductValidation),
    PC.updateProduct)
router.delete('/delete', isAuthenticated, isAuthorized('admin'), validation(deleteProductValidation), PC.deleteProduct)
router.get('/getall', PC.getAll)
router.get('/getById', validation(deleteProductValidation), PC.getProductById)
router.get('/getbyname', validation(searchByNameValidation), PC.searchByName)

export default router