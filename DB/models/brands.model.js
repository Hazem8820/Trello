import mongoose, { Schema, Types, model } from 'mongoose';

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50,
        unique: true,
        lowercase: true
    },
    slug: {
        type: String,
        min: 5,
        max: 50,
        lowercase: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    customId: String,
    brandImage: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },)

brandSchema.virtual('product', {
    ref: "product",
    foreignField: "brandId",
    localField: "_id"
})

const brandModel = mongoose.models.Brand || model('Brand', brandSchema)
export default brandModel
