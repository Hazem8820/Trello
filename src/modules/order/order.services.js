import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";

export const clearCart = asyncHandler(async (userId) => {
    await cartModel.findOneAndUpdate({ user: userId }, { products: [] })
})

export const updateStock = asyncHandler(async (products, stockFlag) => {
    if (stockFlag) {
        for (const product of products) {
            await productModel.findByIdAndUpdate(product.productId,
                {
                    $inc: {
                        availableItems: -product.quantity,
                        soldItems: product.quantity
                    }
                }
            )
        }
    } else {
        for (const product of products) {
            await productModel.findByIdAndUpdate(product.productId,
                {
                    $inc: {
                        availableItems: product.quantity,
                        soldItems: -product.quantity
                    }
                }
            )
        }
    }
})