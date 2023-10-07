import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from './../../middleware/authorization.js';
import { validation } from "../../middleware/validation.js";
import { changePasswordValidation, deleteUserValidation, updateUserValidation } from "./user.validation.js";
import { fileUpload, extensionValidation } from '../../utils/multer.cloud.js'
import * as USC from "./controller/user.controller.js"
import { Router } from "express";

const router = Router()

router.get('/getuser', USC.getUser)
router.put('/update', isAuthenticated, validation(updateUserValidation), USC.updateUser)
router.delete('/delete', isAuthenticated, isAuthorized("admin"), validation(deleteUserValidation), USC.deleteUser)
router.delete('/softDelete', isAuthenticated, isAuthorized("admin"), validation(deleteUserValidation), USC.softDelete)
router.patch('/profile', isAuthenticated, fileUpload(extensionValidation.image).single('image'), USC.profilePic)
router.patch('/cover', isAuthenticated, fileUpload(extensionValidation.image).array('image'), USC.coverPic)
router.delete('/deletecover', isAuthenticated, fileUpload(extensionValidation.image).array('image'), USC.deleteCover)
router.patch('/changePass', isAuthenticated, validation(changePasswordValidation), USC.changePass)
router.patch('/logout', isAuthenticated, USC.logout)


export default router 