import mongoose, { Schema, Types, model } from 'mongoose'

const productSchema = new Schema({
    name: {
        type: String,
        min: 3,
        max: 20,
        required: true,
        lowercase: true
    },
    description: String,
    images: [{ url: { type: String, required: true }, id: { type: String, required: true } }],
    defaultImage: {
        url: { type: String, required: true },
        id: { type: String, required: true }
    },
    availableItems: {
        type: Number,
        min: 1,
        required: true,
    },
    soldItems: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        min: 2,
        required: true,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand",
        required: true
    },
    cloudFolder: String,
    rate: {
        type: Number,
        min: 0,
        max: 5
    },
    manufacturerWarranty: {
        type: Number,
        min: 0,
        max: 10
    },
    reviews: [{ id: { ref: 'Reviews', type: Types.ObjectId } }]
}, { timestamps: true })

productSchema.virtual('finalPrice').get(function () {
    if (this.price) return Number.parseFloat(this.price - (this.price * this.discount || 0) / 100).toFixed(2)
})

productSchema.query.paginate = function (page) {
    !page || page < 0 || isNaN(page) ? 1 : page
    const limit = 2
    const skip = (page - 1) * limit
    return this.skip(skip).limit(limit)
}

productSchema.query.selection = function (fields) {
    if (!fields) return this
    const schemaArr = Object.keys(productModel.schema.paths)
    const fieldsArr = fields.split(' ')
    const matchedKeys = fieldsArr.filter(key => schemaArr.includes(key))
    return this.select(matchedKeys)
}

productSchema.methods.inStock = function (requestedItems) {
    return this.availableItems >= requestedItems ? true : false
}

const productModel = mongoose.models.Product || model("Product", productSchema)
export default productModel