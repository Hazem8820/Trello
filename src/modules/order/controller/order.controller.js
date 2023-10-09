import { asyncHandler } from "../../../utils/globalErrorHandling.js";
import couponModel from './../../../../DB/models/coupon.model.js';
import cartModel from './../../../../DB/models/cart.model.js';
import productModel from './../../../../DB/models/product.model.js';
import { clearCart, updateStock } from "../order.services.js";
import orderModel from './../../../../DB/models/order.model.js';
import createInvoice from "../../../utils/invoiceTemp.js";
import cloudinary from './../../../utils/cloudinary.js';
import sendEmail from './../../../utils/sendemail.js';
import { fileURLToPath } from "url";
import path from 'path'
import Stripe from "stripe";

//////////////////////////////////////////////////////////////////// Create Order /////////////////////////////////////////////////////////////////////////////////////
export const createOrder = asyncHandler(async (req, res, next) => {
    const { address, coupon, phone, payment } = req.body // data
    let checkCoupon;
    if (coupon) {
        checkCoupon = await couponModel.findOne({ name: coupon, expireAt: { $gt: Date.now() } })
        if (!coupon) return next(new Error(`Coupon ${coupon} Not Fount`, { cause: 404 }))
    } // checkCoupon
    const cart = await cartModel.findOne({ user: req.user._id })
    if (!cart.products.length) return next(new Error("Cart is Empty", { cause: 400 })) // check cart
    let orderProducts = []
    let orderPrice = 0
    for (let i = 0; i < cart.products.length; i++) {
        const product = await productModel.findById(cart.products[i].productId)
        if (!product) return next(new Error(`Product ${cart.products[i].productId} Not Found`, { cause: 404 })) // check product
        if (!product.inStock(cart.products[i].quantity)) return next(new Error(`Sorry You Can't Request All This Quantity Because We Have Only ${product.availableItems}`, { cause: 404 })) // check Stock
        orderProducts.push(
            {
                productId: product._id,
                quantity: cart.products[i].quantity,
                name: product.name,
                price: product.finalPrice,
                totalPrice: cart.products[i].quantity * product.finalPrice
            }
        )
        orderPrice += cart.products[i].quantity * product.finalPrice
    }
    const order = await orderModel.create({
        user: req.user._id, products: orderProducts
        , address, phone, payment, price: orderPrice,
        coupon: { id: checkCoupon?._id, name: checkCoupon?.name, discount: checkCoupon?.discount }
    }) // create order
    const invoice = {
        shipping: {
            name: req.user.userName,
            address: order.address,
            country: 'Egypt'
        },
        items: orderProducts,
        subtotal: orderPrice,
        paid: order.finalPrice,
        invoice_nr: order._id
    };// generate Invoice
    const __dirname = fileURLToPath(import.meta.url)
    const pdfPath = path.join(__dirname, `./../../../../../invoices/pdf`)
    createInvoice(invoice, pdfPath)
    const { secure_url, public_id } = cloudinary.uploader.upload(pdfPath, { folder: `e-commerce/orders/invoice/${order._id}` }) // upload invoice
    order.invoice = { url: secure_url, id: public_id }
    await order.save()
    await sendEmail({ to: req.user.email, subject: 'Your Order Invoice', attachments: [{ path: secure_url, contentType: 'application/pdf' }] }) // send mail
    updateStock(order.products, true) // update stock
    clearCart(req.user._id) // clear cart
    // payment visa *Stripe*
    if (payment === 'Visa') {
        const stripe = new Stripe(process.env.STRIPE_KEY)
        let existCoupon;
        if (order.coupon.name !== undefined) {
            existCoupon = await stripe.coupons.create({
                percent_off: order.coupon.discount,
                duration: 'once'
            })
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: { order_id: order._id.toString() },
            success_url: process.env.SUCCESS_URL,
            cancel_url: process.env.CANCEL_URL,
            line_items: order.products.map((pro) => {
                return { price_data: { currency: 'egp', product_data: { name: pro.name }, unit_amount: pro.price * 100 }, quantity: pro.quantity }
            }),
            discounts: existCoupon ? [{ coupon: existCoupon.id }] : []
        })
        return res.status(200).json({ success: true, result: session.url })
    }
    return res.status(201).json({ success: true, message: 'Your Order Created Successfully Please Check Your inBox', order }) // response
})
//////////////////////////////////////////////////////////////////// Cancel Order /////////////////////////////////////////////////////////////////////////////////////
export const cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.query.id)
    if (!order) return next(new Error('In_Valid Order Id', { cause: 400 })) // check order
    if (order.status !== 'Placed') next(new Error('Can Not Cancel a Shipped/Delivered/Canceled Order', { cause: 400 })) // check order's status
    order.status = 'Canceled'
    await order.save()
    updateStock(order.products, false)
    return res.status(200).json({ success: true, message: 'Your Order Canceled Successfully' })
})
//////////////////////////////////////////////////////////////////// ReOrder /////////////////////////////////////////////////////////////////////////////////////
export const reOrder = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findOne({ user: req.user._id, _id: req.query.id })
    if (!order) return next(new Error('In_Valid Order Id')) // check order
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, { products: order.products }, { new: true })
    return res.status(200).json({ success: true, message: 'You Have ReOrdered Successfully Please Check Your Cart', cart })
})
//////////////////////////////////////////////////////////////////// Get All Orders /////////////////////////////////////////////////////////////////////////////////////
export const getAllUserOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderModel.find({ user: req.user._id })
    if (!orders) return next(new Error('You Did Not Order Yet'))
    return res.status(200).json({ success: true, orders })
})
export const orderWebHook = asyncHandler(async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_KEY)
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    const order_id = event.data.object.metadata.order_id
    if (event.type === 'checkout.session.completed') {
        const order_id = event.data.object.metadata.order_id
        await orderModel.findByIdAndUpdate(order_id, { paid: true })
        return;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
})