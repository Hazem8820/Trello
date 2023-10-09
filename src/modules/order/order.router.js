import isAuthenticated from './../../middleware/authentication.js';
import { validation } from "../../middleware/validation.js";
import { cancelOrderValidation, createOrderValidation } from "./order.validation.js";
import * as OC from './controller/order.controller.js'
import { Router } from "express"
import express from 'express'
const router = Router()

router.post('/create', isAuthenticated, validation(createOrderValidation), OC.createOrder)
router.patch('/cancel', isAuthenticated, validation(cancelOrderValidation), OC.cancelOrder)
router.patch('/reorder', isAuthenticated, validation(cancelOrderValidation), OC.reOrder)
router.get('/getAll', isAuthenticated, OC.getAllUserOrders)
router.post('/webhook', express.raw({ type: 'application/json' }), OC.orderWebHook);


export default router