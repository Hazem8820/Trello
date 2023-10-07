import { Router } from 'express'
import isAuthenticated from '../../middleware/authentication.js'
import { validation } from '../../middleware/validation.js'
import * as RC from '../reviews/controller/reviews.controller.js'
import { createReviewValidation, deleteReviewValidation, updateReviewValidation } from './reviews.validaion.js'
const router = Router()
router.post("/create", isAuthenticated, validation(createReviewValidation), RC.createReview)
router.patch("/update", isAuthenticated, validation(updateReviewValidation), RC.updateReview)
router.delete("/delete", isAuthenticated, validation(deleteReviewValidation), RC.deleteReview)
router.get("/getall", RC.getAll)
export default router