import userModel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandling.js"
import taskModel from './../../../../DB/models/task.model.js';
import cloudinary from '../../../utils/cloudinary.js';

//////////////////////////////////////////////////////////////////// Add Task /////////////////////////////////////////////////////////////////////////////////////
export const addTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, deadline } = req.body
    const task = new taskModel({ title, description, status, userId: req.user._id, assignTo: req.user._id, deadline })
    await userModel.findByIdAndUpdate(req.user._id, {
        $push: { tasks: task._id }
    })
    await task.save()
    return task ? res.status(200).json({ message: "success", report: "task added" }) : next(new Error("something went wrong please try again later", { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Update Task /////////////////////////////////////////////////////////////////////////////////////
export const updateTask = asyncHandler(async (req, res, next) => {
    const { title, description, status, assignTo } = req.body
    const task = await taskModel.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { title, description, status, assignTo })
    return task ? res.status(200).json({ message: "success", report: "Data Updated" }) : next(new Error("something went wrong try again later", { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Delete Task /////////////////////////////////////////////////////////////////////////////////////
export const deleteTask = asyncHandler(async (req, res, next) => {
    const task = await taskModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    return task ? res.status(200).json({ message: "success", report: "Data Deleted" }) : next(new Error("something went wrong try again later", { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Get Tasks With User/////////////////////////////////////////////////////////////////////////////////////
export const tasksWithUsers = asyncHandler(async (req, res, next) => {
    const task = await taskModel.find({}).populate({
        path: "userId"
    })
    return res.status(200).json({ message: "success", task })
})
//////////////////////////////////////////////////////////////////// Get Users With Tasks /////////////////////////////////////////////////////////////////////////////////////
export const userWithTasks = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id).populate([{
        path: "tasks"
    }])
    return res.status(200).json({ message: "success", user })
})
//////////////////////////////////////////////////////////////////// Get Users With Tasks *Params* /////////////////////////////////////////////////////////////////////////////////////
export const userAndTasks = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id).populate([{
        path: "tasks"
    }])
    return res.status(200).json({ message: "success", user })
})
//////////////////////////////////////////////////////////////////// Not Done Tasks /////////////////////////////////////////////////////////////////////////////////////
export const notdone = asyncHandler(async (req, res, next) => {
    const dateNow = new Date().getTime()
    const task = await taskModel.find({ deadline: { $ne: "done", $lte: dateNow } })
    return res.status(200).json({ message: "success", task })
})
//////////////////////////////////////////////////////////////////// Add Attachment To Task /////////////////////////////////////////////////////////////////////////////////////
export const taskAttachment = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new Error("Please Upload an Attachment", { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Trello/tasks/${req.user._id}/attachment` })
    const task = await taskModel.findOneAndUpdate({ userId: req.user._id }, { attachment: { secure_url, public_id } }, { new: true })
    if (!task) {
        await cloudinary.uploader.destroy(public_id)
        return res.status(400).json({ message: "failed", reason: "task not found" })
    }
    return res.status(200).json({ message: 'success', task })
})