import * as AC from "./controller/auth.controller.js"
import { validation } from "../../middleware/validation.js";
import { resetPasswordCodeValidation, resetPasswordEmailValidation, signInValidation, signUpValidation } from "./auth.validation.js";
import { Router } from "express";
const router = Router()

router.post('/signup', validation(signUpValidation), AC.Signup)
router.get('/confirmemail/:token', AC.confirmemail)
router.get('/newconfirmemail/:token', AC.newConfirmRequest)
router.post('/signin', validation(signInValidation), AC.Signin)
router.post('/resetpasswordemail', validation(resetPasswordEmailValidation), AC.resetPasswordEmail)
router.put('/resetpasswordcode', validation(resetPasswordCodeValidation), AC.resetPasswordCode)


export default router 