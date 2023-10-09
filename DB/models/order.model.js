import mongoose, { Schema, Types, model } from 'mongoose'

const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a valid User ID']
    },
    products: [
        {
            productId: { type: Types.ObjectId, ref: 'Product' },
            quantity: { type: Number },
            name: String,
            price: Number,
            totalPrice: Number
        }
    ],
    invoice: { url: { type: String }, id: { type: String } },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number },
    coupon: {
        id: { type: Types.ObjectId, ref: 'Coupon' },
        name: String,
        discount: Number
    },
    status: {
        type: String,
        enum: ['Placed', 'Shipped', 'Delivered', 'Canceled', 'Refunded'],
        default: 'Placed'
    },
    paid: {
        type: Boolean,
        default: false
    },
    payment: {
        type: String,
        enum: ['Cash', 'Visa'],
        default: 'Cash'
    }
}, { timestamps: true })

orderSchema.virtual('finalPrice').get(function () {
    return this.coupon ? Number.parseFloat(this.price - (this.price * this.coupon.discount || 0) / 100).toFixed(2) : this.price
})

const orderModel = mongoose.models.Order || model('Order', orderSchema)
export default orderModel