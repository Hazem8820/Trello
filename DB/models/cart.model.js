import mongoose, { Schema, model, Types } from "mongoose"

const cartSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: [{ productId: { type: Types.ObjectId, ref: 'Product', unique: true }, quantity: { type: Number, default: 1 }, _id: false }]
}, { timestamps: true })

const cartModel = mongoose.models.Cart || model('Cart', cartSchema)
export default cartModel