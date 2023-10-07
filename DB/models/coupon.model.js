import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
    name: {
        type: String,
        min: 5,
        max: 30,
        required: true,
        lowercase: true
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    expireAt: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const couponModel = mongoose.models.Coupon || model('Coupon', couponSchema)
export default couponModel