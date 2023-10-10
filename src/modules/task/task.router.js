import { Router } from "express";
import * as taskController from "./controller/task.controller.js"
import * as taskValidator from "./taskValidation.js"
import { fileUpload, extensionValidation } from './../../utils/multer.cloud.js';
import { validation } from "../../middleware/validation.js";
import isAuthenticated from './../../middleware/authentication.js';
const router = Router()

router.post('/addtask', isAuthenticated, validation(taskValidator.addTask), taskController.addTask)
router.put('/update/:id', isAuthenticated, validation(taskValidator.updateTask), taskController.updateTask)
router.delete('/delete/:id', isAuthenticated, validation(taskValidator.deleteTask), taskController.deleteTask)
router.get('/tasksWithUsers', taskController.tasksWithUsers)
router.get('/userWithTasks', isAuthenticated, taskController.userWithTasks)
router.get('/userAndTasks/:id', taskController.userAndTasks)
router.get('/notdone', taskController.notdone)
router.patch('/attachment', isAuthenticated, fileUpload(extensionValidation.image).single("image"), taskController.taskAttachment)

export default router