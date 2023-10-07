import multer from "multer"

export const extensionValidation = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    file: ['application/pdf', 'application/msword']
}

export const fileUpload = (customValidation = []) => {
    const storage = multer.diskStorage({})
    const fileFilter = (req, file, cb) => {
        return customValidation.includes(file.mimetype) ? cb(null, true) : cb(new Error('In_Valid Format', { cause: 400 }), false)
    }
    const uploads = multer({ fileFilter, storage })
    return uploads
}