import { globalErrorHandler } from "./utils/globalErrorHandling.js"
import authRouter from '../src/modules/auth/auth.router.js'
import userRouter from '../src/modules/user/user.router.js'
import categoryRouter from '../src/modules/category/category.router.js'
import subcategoryRouter from '../src/modules/subcategory/subcategory.router.js'
import brandsRouter from '../src/modules/brands/brands.router.js'
import productRouter from '../src/modules/product/product.router.js'
import couponRouter from '../src/modules/coupon/coupon.router.js'
import cartRouter from '../src/modules/cart/cart.router.js'
import orderRouter from '../src/modules/order/order.router.js'
import reviewsRouter from '../src/modules/reviews/reviews.router.js'
import connectDB from "../DB/connection.js"
import cors from "cors"
const appRouter = (express, app) => {
    // CORS
    // const whitelist = ["http://127.0.0.1:5500"]
    // app.use((req, res, next) => {
    //     if (req.originalUrl.includes("/auth/confirmemail")) {
    //         res.setHeader("Access_Control_Allow_Origin", "*")
    //         res.setHeader("Access_Control_Allow_Methods", "GET")
    //         return next()
    //     }
    //     if (!whitelist.includes(req.header('origin'))) {
    //         return next(new Error('Blocked By CORS'))
    //     }
    //     res.setHeader("Access_Control_Allow_Origin", "*")  // Domain
    //     res.setHeader("Access_Control_Allow_Headers", "*") // DEFAULT VALUES
    //     res.setHeader("Access_Control_Allow_Methods", "*") // GET POST PATCH PUT DELETE
    //     res.setHeader("Access_Control_Allow_Private_Network", true) // local or live
    //     return next()
    // })
    app.use(cors())
    connectDB()
    app.use(express.json())
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/category', categoryRouter)
    app.use('/subcategory', subcategoryRouter)
    app.use('/brands', brandsRouter)
    app.use('/product', productRouter)
    app.use('/coupon', couponRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    app.use('/reviews', reviewsRouter)
    app.all("*", (req, res, next) => { next(new Error("End Point Not Found", { cause: 404 })) })
    app.use(globalErrorHandler)
}
export default appRouter