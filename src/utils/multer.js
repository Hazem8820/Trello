import multer from "multer"
import path from "path"
import { nanoid } from "nanoid"
import fs from 'fs'

export const extensionValidation = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    file: ['application/pdf', 'application/msword']
}

export const fileUpload = (customPath = '', customValidation = []) => {
    const fullFilePath = path.resolve(`../../../uploads/${customPath}`)
    if (!fs.existsSync(fullFilePath)) fs.mkdirSync(fullFilePath, { recursive: true })
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullFilePath)
        },
        filename: (req, file, cb) => {
            const fullFileName = nanoid() + '_' + file.originalname
            file.finalDest = `/uploads/${customPath}/${fullFileName}`
            cb(null, fullFileName)
        }
    })
    const fileFilter = (req, file, cb) => {
        return customValidation.includes(file.mimetype) ? cb(null, true) : cb(new Error("In_Valid Format", { cause: 400 }), false)
    }
    const upload = multer({ fileFilter, storage })
    return upload
}