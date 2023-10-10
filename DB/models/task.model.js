import { Schema, Types, model } from "mongoose"
const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['todo', 'doing', 'done']
    },
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    assignTo: {
        type: Types.ObjectId,
        ref:"User"
    },
    deadline: {
        type: String,
        required: true
    },
    attachment: { secure_url: String, public_id: String }
}, { timestamps: true })

const taskModel = model('Task', taskSchema)
export default taskModel