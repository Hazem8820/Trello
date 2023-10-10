import joi from "joi"
import { globalValidation } from "../../middleware/validation.js"

export const addTask = joi.object({
    title: globalValidation.title,
    description: globalValidation.description,
    status: globalValidation.status,
    deadline: globalValidation.deadline
})

export const updateTask = joi.object({
    id: globalValidation._id,
    title: globalValidation.title,
    description: globalValidation.description,
    status: globalValidation.status,
    assignTo: globalValidation._id
})

export const deleteTask = joi.object({
    id: globalValidation._id
})