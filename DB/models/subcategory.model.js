import mongoose, { Schema, Types, model } from 'mongoose';

const subCategorySchema = new Schema({
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
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategoryImage: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    }
}, { timestamps: true })

subCategorySchema.virtual('Product', {
    ref: 'Product',
    foreignField: 'subCategoryId',
    localField: '_id'
})

const subCategoryModel = mongoose.models.subCategory || model('subCategory', subCategorySchema)
export default subCategoryModel
