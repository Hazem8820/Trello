import isAuthenticated from './../../middleware/authentication.js';
import { validation } from "../../middleware/validation.js";
import { cartValidationSchema, removeCartValidationSchema } from './cart.validaion.js';
import * as CAC from './controller/cart.controller.js'
import { Router } from 'express'
const router = Router()

router.post('/add', isAuthenticated, validation(cartValidationSchema), CAC.addToCart)
router.get('/getCart', isAuthenticated, CAC.userCart)
router.patch('/update', isAuthenticated, validation(cartValidationSchema), CAC.updateCart)
router.put('/remove', isAuthenticated, validation(removeCartValidationSchema), CAC.removeProduct)
router.patch('/clear', isAuthenticated, CAC.clearCart)

export default router