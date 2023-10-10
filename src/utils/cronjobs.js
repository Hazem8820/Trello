import schedule from 'node-schedule'
import { asyncHandler } from './globalErrorHandling.js'
import userModel from '../../DB/models/user.model.js'
import orderModel from '../../DB/models/order.model.js'
import tokenModel from '../../DB/models/token.model.js'

const unSubscribe = schedule("* * */23 * * *", asyncHandler(async () => {
    await userModel.deleteMany({ isConfirmed: false })
}))
const tokenManage = schedule("* * */23 * * *", asyncHandler(async () => {
    await tokenModel.deleteMany({ isValid: false })
}))