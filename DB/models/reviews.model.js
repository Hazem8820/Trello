import mongoose, { Schema, Types, model } from "mongoose";

const reviewsSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })


const reviewModel = mongoose.models.Reviews || model('Reviews', reviewsSchema)
export default reviewModel