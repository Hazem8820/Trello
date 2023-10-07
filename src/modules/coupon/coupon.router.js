import { Router } from "express";
import isAuthenticated from './../../middleware/authentication.js';
import isAuthorized from "../../middleware/authorization.js";
import { validation } from "../../middleware/validation.js";
import { createCouponValidaion, deleteCouponValidation, updateCouponValidation } from './coupon.validation.js'
import * as coupC from './controller/coupon.controller.js'
const router = Router()

router.post('/create', isAuthenticated, isAuthorized('admin'), validation(createCouponValidaion), coupC.createCoupon)
router.put('/update', isAuthenticated, isAuthorized('admin'), validation(updateCouponValidation), coupC.updateCoupon)
router.delete('/delete', isAuthenticated, isAuthorized('admin'), validation(deleteCouponValidation), coupC.deleteCoupon)
router.get('/getall', coupC.getAll)
router.get('/getById', validation(deleteCouponValidation), coupC.getById)

export default router