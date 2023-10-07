import subCategoryModel from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import categoryModel from './../../../../DB/models/category.model.js';
import cloudinary from './../../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import slugify from "slugify";

//////////////////////////////////////////////////////////////////// Create Category /////////////////////////////////////////////////////////////////////////////////////
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const cateName = await categoryModel.findOne({ name }) // check name
    if (cateName) return next(new Error("Category Name is Duplicated", { cause: 409 }))
    const slug = slugify(name, '_') // create slug
    const customId = nanoid() // create custom Id
    if (!req.file) return next(new Error('Please Upload Category Image', { cause: 400 })) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/Categories/${customId}` }) // upload pic
    const categoryDB = await categoryModel.create({ name, slug, createdBy: req.user._id, customId, categoryImage: { url: secure_url, id: public_id } }) // create category
    return res.status(201).json({ success: true, message: 'Category Successfully Added', result: categoryDB })
})
//////////////////////////////////////////////////////////////////// Update Category /////////////////////////////////////////////////////////////////////////////////////
export const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.query.id)
    if (!category) return next(new Error("In_Valid Category Id", { cause: 409 })) // check id
    if (req.user._id.toString() !== category.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    const cateName = await categoryModel.findOne({ name: req.body.name })
    if (cateName) return next(new Error("Category Name is Duplicated", { cause: 409 })) // check name
    const slug = slugify(req.body.name, '_') // create slug 
    if (!req.file) return next(new Error("Please Upload Category Image", { cause: 409 })) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/Categories/${category.customId}` }) // upload new pic
    await cloudinary.uploader.destroy(category.categoryImage.id) // delete old pic
    const categoryDB = await categoryModel.findByIdAndUpdate(req.query.id, { name: req.body.name, slug, categoryImage: { url: secure_url, id: public_id } }, { new: true })
    return res.status(200).json({ success: true, message: "Category is successfully Updated", result: categoryDB })
})
//////////////////////////////////////////////////////////////////// Delete Brand /////////////////////////////////////////////////////////////////////////////////////
export const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findByIdAndDelete(req.query.id)
    if (!category) return next(new Error("In_Valid Category Id"), { cause: 400 }) // check category
    if (req.user._id.toString() !== category.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    await cloudinary.api.delete_resources_by_prefix(`e-commerce/Categories/${category.customId}`) // delete files
    await cloudinary.api.delete_folder(`e-commerce/Categories/${category.customId}`) // delete folder
    const subCategory = await subCategoryModel.deleteMany({ categoryId: category._id }) // delete Related subCategory
    if (!subCategory.deletedCount) return next(new Error("subCategory Delete Failed"), { cause: 400 })
    return res.status(200).json({ success: true, message: 'Category Successfully Removed' })
})
//////////////////////////////////////////////////////////////////// Get Brand /////////////////////////////////////////////////////////////////////////////////////
export const getCategory = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find().populate([
        {
            path: 'subCategories'
        },
        {
            path:'Product'
        }
    ])
    return categories ? res.status(200).json({ success: true, result: categories }) : next(new Error('something went wrong please try again later', { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Get Brand By Id /////////////////////////////////////////////////////////////////////////////////////
export const getCategoryId = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.findById(req.params.id).populate([
        {
            path: 'subCategories'
        }
    ])
    return categories ? res.status(200).json({ success: true, result: categories }) : next(new Error('In_Valid Category Id', { cause: 400 }))
})