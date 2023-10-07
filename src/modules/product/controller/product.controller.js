import { asyncHandler } from './../../../utils/globalErrorHandling.js';
import cloudinary from './../../../utils/cloudinary.js';
import { nanoid } from 'nanoid';
import productModel from './../../../../DB/models/product.model.js';
import categoryModel from './../../../../DB/models/category.model.js';
import subCategoryModel from './../../../../DB/models/subcategory.model.js';
import brandModel from './../../../../DB/models/brands.model.js';

//////////////////////////////////////////////////////////////////// Create Product /////////////////////////////////////////////////////////////////////////////////////
export const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, availableItems, soldItems, price, discount, categoryId, subCategoryId, brandId } = req.body // get data
    const checkCat = await categoryModel.findById(categoryId)
    if (!checkCat) return next(new Error('In_Valid Category Id', { cause: 400 })) // check category
    const checkSubCat = await subCategoryModel.findById(subCategoryId)
    if (!checkSubCat) return next(new Error('In_Valid subCategory Id', { cause: 400 })) // check subCategory
    const checkBrand = await brandModel.findById(brandId)
    if (!checkBrand) return next(new Error('In_Valid Brand Id', { cause: 400 })) // check Brand
    if (!req.files) return next(new Error('Please Upload Some Pictures', { cause: 400 })) // check Images
    const cloudFolder = nanoid()
    const images = []
    for (const file of req.files.Images) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `e-commerce/products/${cloudFolder}/images` })
        images.push({ url: secure_url, id: public_id })
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path, { folder: `e-commerce/products/${cloudFolder}/defaultImage` }) // upload pics on host
    const product = await productModel.create({
        name, description, images, defaultImage: { url: secure_url, id: public_id },
        availableItems, soldItems, price, discount, createdBy: req.user._id, categoryId, subCategoryId, brandId, cloudFolder
    }) // create product
    res.status(201).json({ success: true, message: "Product Created Successfully", product: { product, finalPrice: product.finalPrice } })
})
//////////////////////////////////////////////////////////////////// Update Product /////////////////////////////////////////////////////////////////////////////////////
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { name, description, availableItems, price, discount, categoryId, subCategoryId, brandId } = req.body // data
    const product = await productModel.findById(req.query.id)
    if (!product) return next(new Error('In_Valid Product Id', { cause: 400 })) // check product
    if (product.createdBy.toString() !== req.user._id.toString()) return next(new Error('You Are Not Authorized', { cause: 403 }))
    const category = await categoryModel.findById(categoryId)
    if (!category) return next(new Error('In_Valid Category Id', { cause: 400 })) // check category
    const subCategory = await subCategoryModel.findById(subCategoryId)
    if (!subCategory) return next(new Error('In_Valid subCategory Id', { cause: 400 })) // check subCategory
    const brand = await brandModel.findById(brandId)
    if (!brand) return next(new Error('In_Valid Brand Id', { cause: 400 })) // check brand
    if (!req.files) return next(new Error('Please Upload Some Pictures', { cause: 400 }))
    await cloudinary.api.delete_resources_by_prefix(`e-commerce/products/${product.cloudFolder}/images`) // delete old pictures
    await cloudinary.uploader.destroy(product.defaultImage.id) // delete old default image
    const images = []
    for (const file of req.files.Images) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `e-commerce/products/${product.cloudFolder}/images` })
        images.push({ url: secure_url, id: public_id })
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path, { folder: `e-commerce/products/${product.cloudFolder}/defaultImage` })
    const newProduct = await productModel.findByIdAndUpdate(req.query.id, {
        name, description, availableItems, price, discount, images, defaultImage: { url: secure_url, id: public_id },
        categoryId, subCategoryId, brandId
    }, { new: true })
    return res.status(200).json({ success: true, message: 'Product Successfully Updated', newProduct })
})
//////////////////////////////////////////////////////////////////// Delete Product /////////////////////////////////////////////////////////////////////////////////////
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await productModel.findById(req.query.id)
    if (!product) return next(new Error('Product Not Found', { cause: 404 })) // check product
    if (req.user._id.toString() !== product.createdBy.toString()) return next(new Error('You Are Not Authorized', { cause: 400 })) // check createdBy
    const delPro = await productModel.findByIdAndDelete(req.query.id)
    await cloudinary.api.delete_resources_by_prefix(`e-commerce/products/${delPro.cloudFolder}`) // delete files
    await cloudinary.api.delete_folder(`e-commerce/products/${delPro.cloudFolder}`) // delete folder
    return res.status(200).json({ success: true, message: 'product deleted successfully' })
})
//////////////////////////////////////////////////////////////////// Gel All Products /////////////////////////////////////////////////////////////////////////////////////
export const getAll = asyncHandler(async (req, res, next) => {
    const products = await productModel.find().paginate(req.query.page).selection(req.query.fields).sort(req.query.sort).populate('reviews.id')
    return res.status(200).json({ success: true, result: products })
})
//////////////////////////////////////////////////////////////////// Get Product By Id /////////////////////////////////////////////////////////////////////////////////////
export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await productModel.findById(req.query.id).populate([
        {
            path: 'categoryId'
        },
        {
            path: 'subCategoryId'
        },
        {
            path: 'brandId'
        }
    ])
    return res.status(200).json({ success: true, product })
})
//////////////////////////////////////////////////////////////////// Search By Name /////////////////////////////////////////////////////////////////////////////////////
export const searchByName = asyncHandler(async (req, res, next) => {
    const product = await productModel.find({ $or: [{ name: { $regex: req.query.keyword } }, { description: { $regex: req.query.keyword } }] }).populate([
        {
            path: 'categoryId'
        },
        {
            path: 'subCategoryId'
        },
        {
            path: 'brandId'
        }
    ])
    return res.status(200).json({ success: true, product })
})



