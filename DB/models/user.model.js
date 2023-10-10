import mongoose, { Schema, Types, model } from "mongoose"
//schema
const userSchema = new Schema({
    firstName: {
        type: String,
        min: 5,
        max: 20,
        required: true
    },
    lastName: {
        type: String,
        min: 5,
        max: 20,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        min: 5,
        max: 50,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
        default: "male",
        lowercase: true
    },
    age: {
        type: String
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'offline'
    },
    role: {
        type: String,
        default: 'user'
    },
    profileImage: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/djmybyzgy/image/upload/v1693421963/E-commerce/E-commerce%28Default%29/default-profile-photo_szjb3k.jpg"
        },
        id: {
            type: String,
            default: "E-commerce/E-commerce%28Default%29/default-profile-photo_szjb3k"
        }
    },
    coverImages: [{ url: String, id: String }],
    forgotCode: String,
    tasks: [{
        type: Types.ObjectId,
        ref: 'Task'
    }]
}, { timestamps: true })
// model
const userModel = mongoose.models.User || model("User", userSchema)
export default userModel
