import slugify from "slugify";
import subCategoryModel from "../../../../DB/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import categoryModel from './../../../../DB/models/category.model.js';
import cloudinary from './../../../utils/cloudinary.js';

//////////////////////////////////////////////////////////////////// create subCategory /////////////////////////////////////////////////////////////////////////////////////
export const createSubCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.query.categoryId)
    if (!category) return next(new Error('In_Valid Category Id'), { cause: 400 }) // check cate id
    const subCateName = await subCategoryModel.findOne({ name: req.body.name })
    if (subCateName) return next(new Error('subCategory Name is Duplicated'), { cause: 409 }) // check sub name
    const slug = slugify(req.body.name, '_') // create slug
    if (!req.file) return next(new Error('Please Upload Picture'), { cause: 400 }) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/subCategoies/${category._id}` }) // save image
    const subCategoryDB = await subCategoryModel.create({ name: req.body.name, slug, createdBy: req.user._id, categoryId: req.params.categoryId, subCategoryImage: { url: secure_url, id: public_id } })
    return res.status(200).json({ success: true, message: 'subCategory successfully Added', result: subCategoryDB })
})
//////////////////////////////////////////////////////////////////// update subCategory /////////////////////////////////////////////////////////////////////////////////////
export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error('In_Valid Category Id'), { cause: 400 }) // check cate id
    const subCategory = await subCategoryModel.findById(req.params.subCategoryId)
    if (!subCategory) return next(new Error('In_Valid subCategory Id'), { cause: 400 }) // check subCategory
    if (req.user._id.toString() !== subCategory.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    const subCateName = await subCategoryModel.findOne({ name: req.body.name })
    if (subCateName) return next(new Error('subCategory Name is Duplicated'), { cause: 409 }) // check sub name
    const slug = slugify(req.body.name, '_') // create slug
    if (!req.file) return next(new Error('Please Upload Picture'), { cause: 400 }) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/subCategoies/${category._id}` }) // save image
    await cloudinary.uploader.destroy(subCategory.subCategoryImage.id) // delete old pic
    const subCategoryDB = await subCategoryModel.findByIdAndUpdate(req.params.subCategoryId, { name: req.body.name, slug, categoryId: req.params.categoryId, subCategoryImage: { url: secure_url, id: public_id } }, { new: true }) // update
    return res.status(200).json({ success: true, message: 'subCategory successfully updated', result: subCategoryDB })
})
//////////////////////////////////////////////////////////////////// Delete subCategory /////////////////////////////////////////////////////////////////////////////////////
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const subCategory = await subCategoryModel.findByIdAndDelete(req.params.subCategoryId)
    if (!subCategory) return next(new Error('In_Valid subCategory Id'), { cause: 400 }) // check subCategory
    if (req.user._id.toString() !== subCategory.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    await cloudinary.uploader.destroy(subCategory.subCategoryImage.id)
    return res.status(200).json({ success: true, message: 'subCategory Successfully Removed' })
})
//////////////////////////////////////////////////////////////////// Get All SubCategory /////////////////////////////////////////////////////////////////////////////////////
export const getSubCategory = asyncHandler(async (req, res, next) => {
    const subcategories = await subCategoryModel.find().populate([
        {
            path: 'categoryId'
        }
    ])
    return subcategories ? res.status(200).json({ success: true, result: subcategories }) : next(new Error('something went wrong please try again later', { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Get subCategory By Id /////////////////////////////////////////////////////////////////////////////////////
export const getSubCategoryId = asyncHandler(async (req, res, next) => {
    const subcategories = await subCategoryModel.findById(req.params.id).populate([
        {
            path: 'categoryId'
        }
    ])
    return subcategories ? res.status(200).json({ success: true, result: subcategories }) : next(new Error('In_Valid Category Id', { cause: 400 }))
})