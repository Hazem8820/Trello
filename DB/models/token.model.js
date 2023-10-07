import mongoose, { Schema, Types, model } from "mongoose";
// Schema
const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "user"
    },
    isValid: {
        type: Boolean,
        default: true
    },
    agent: String,
    expireAt: String
}, { timestamps: true })
// model
const tokenModel = mongoose.models.token || model('token', tokenSchema)
export default tokenModel