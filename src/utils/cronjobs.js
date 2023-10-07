import schedule from 'node-schedule'
import { asyncHandler } from './globalerrorhandling.js'
import userModel from '../../DB/models/user.model.js'
import orderModel from '../../DB/models/order.model.js'
import tokenModel from '../../DB/models/token.model.js'

const unSubscribe = schedule("* * */23 * * *", asyncHandler(async () => {
    await userModel.deleteMany({ isConfirmed: false })
}))
const canceledOrders = schedule("* * */23 * * *", asyncHandler(async () => {
    await orderModel.deleteMany({ status: 'Canceled' })
}))
const tokenManage = schedule("* * */23 * * *", asyncHandler(async () => {
    await tokenModel.deleteMany({ isValid: false })
}))