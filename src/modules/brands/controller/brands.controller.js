import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import cloudinary from './../../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import slugify from "slugify";
import brandModel from './../../../../DB/models/brands.model.js';

//////////////////////////////////////////////////////////////////// Add Brand /////////////////////////////////////////////////////////////////////////////////////
export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const brandName = await brandModel.findOne({ name }) // check name
    if (brandName) return next(new Error("Brand Name is Duplicated", { cause: 409 }))
    const slug = slugify(name, '_') // create slug
    const customId = nanoid() // create custom Id
    if (!req.file) return next(new Error('Please Upload Brand Image', { cause: 400 })) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/Brands/${customId}` }) // upload pic
    const brandDB = await brandModel.create({ name, slug, createdBy: req.user._id, customId, brandImage: { url: secure_url, id: public_id } }) // create category
    return res.status(201).json({ success: true, message: 'Brand Successfully Added', result: brandDB })
})
//////////////////////////////////////////////////////////////////// Update Brand /////////////////////////////////////////////////////////////////////////////////////
export const updateBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.findById(req.query.id)
    if (!brand) return next(new Error("In_Valid Brand Id", { cause: 409 })) // check id
    if (req.user._id.toString() !== brand.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    const brandName = await brandModel.findOne({ name: req.body.name })
    if (brandName) return next(new Error("Brand Name is Duplicated", { cause: 409 })) // check name
    const slug = slugify(req.body.name, '_') // create slug 
    if (!req.file) return next(new Error("Please Upload Brand Image", { cause: 409 })) // check image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `e-commerce/Brands/${brand.customId}` }) // upload new pic
    await cloudinary.uploader.destroy(brand.brandImage.id) // delete old pic
    const brandDB = await brandModel.findByIdAndUpdate(req.query.id, { name: req.body.name, slug, categoryImage: { url: secure_url, id: public_id } }, { new: true })
    return res.status(200).json({ success: true, message: "Brand is successfully Updated", result: brandDB })
})
//////////////////////////////////////////////////////////////////// Delete Brand /////////////////////////////////////////////////////////////////////////////////////
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.findByIdAndDelete(req.query.id) 
    if (!brand) return next(new Error("In_Valid Brand Id"), { cause: 400 }) // Check Brand
    if (req.user._id.toString() !== brand.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 403 })) // check createdBy
    await cloudinary.api.delete_resources_by_prefix(`e-commerce/Brands/${brand.customId}`) // delete all files
    await cloudinary.api.delete_folder(`e-commerce/Brands/${brand.customId}`) // delete folder
    return res.status(200).json({ success: true, message: 'Brand Successfully Removed' })
})
//////////////////////////////////////////////////////////////////// Get Brands /////////////////////////////////////////////////////////////////////////////////////
export const getBrands = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find()
    return brand ? res.status(200).json({ success: true, result: brand }) : next(new Error('something went wrong please try again later', { cause: 400 }))
})
//////////////////////////////////////////////////////////////////// Get Brand By Id /////////////////////////////////////////////////////////////////////////////////////
export const getBrandsById = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.findById(req.params.id)
    return brand ? res.status(200).json({ success: true, result: brand }) : next(new Error('In_Valid Brand Id', { cause: 400 }))
})