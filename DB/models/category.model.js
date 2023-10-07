import mongoose, { Schema, Types, model } from 'mongoose';

const categorySchema = new Schema({
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
    categoryImage: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },
    brandId: {
        type: Types.ObjectId,
        ref:'Brand',
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },)

categorySchema.virtual('subCategories', {
    ref: 'subCategory',
    foreignField: 'categoryId',
    localField: '_id'
})
categorySchema.virtual('Product', {
    ref: 'Product',
    foreignField: 'categoryId',
    localField: '_id'
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema)
export default categoryModel
