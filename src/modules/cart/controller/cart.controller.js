import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import productModel from './../../../../DB/models/product.model.js';
import cartModel from './../../../../DB/models/cart.model.js';

//////////////////////////////////////////////////////////////////// Add To Cart /////////////////////////////////////////////////////////////////////////////////////
export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    const checkPro = await productModel.findById(productId) // check product
    if (!checkPro) return next(new Error('In-Valid Product Id', { cause: 400 }))
    if (!checkPro.inStock(quantity)) return next(new Error(`Sorry You Can't Request All This Quantity Because We Have Only ${checkPro.availableItems}`, { cause: 400 }))// check stock
    let cart = await cartModel.findOne({ user: req.user._id }) // to not duplicate the product
    const checkCart = cart.products.filter(key => { return String(key.productId) === productId })
    if (!cart.products.length || !checkCart.length) {
        cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { $push: { products: { productId, quantity } } }, { new: true })
    } else if (checkPro.availableItems >= checkCart[0].quantity + quantity) {
        checkCart[0].quantity += quantity
        await cart.save()
    }
    return res.status(200).json({ success: true, cart, message: 'Product Added Successfully' }) // response
})
//////////////////////////////////////////////////////////////////// User Cart /////////////////////////////////////////////////////////////////////////////////////
export const userCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id }).populate('products.productId')
    return res.status(200).json({ success: true, cart })
})
//////////////////////////////////////////////////////////////////// Update Cart /////////////////////////////////////////////////////////////////////////////////////
export const updateCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    const checkPro = await productModel.findById(productId) // check Product
    if (!checkPro) return next(new Error('In_Valid Product Id', { cause: 400 }))
    if (checkPro.inStock(quantity)) return next(new Error(`Sorry You Can't Request All This Quantity Because We Have Only ${checkPro.availableItems}`, { cause: 400 })) // check stock
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id, 'products.productId': productId }, { 'products.$.quantity': quantity }, { new: true })
    return res.status(200).json({ success: true, cart, message: "Quantity Updated Successfully" })
})
//////////////////////////////////////////////////////////////////// Remove Product /////////////////////////////////////////////////////////////////////////////////////
export const removeProduct = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { $pull: { products: { productId: req.query.id } } }, { new: true })
    return res.status(200).json({ success: true, cart, message: "Product Removed Successfully" })
})
//////////////////////////////////////////////////////////////////// Clear Cart /////////////////////////////////////////////////////////////////////////////////////
export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { $set: { products: [] } }, { new: true })
    return res.status(200).json({ success: true, cart, message: "Cart is Clear Now" })
})