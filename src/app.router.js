import { globalErrorHandler } from "./utils/globalErrorHandling.js"
import authRouter from '../src/modules/auth/auth.router.js'
import userRouter from '../src/modules/user/user.router.js'
import taskRouter from '../src/modules/task/task.router.js'
import connectDB from "../DB/connection.js"
import cors from "cors"
const appRouter = (express, app) => {
    // CORS
    // const whitelist = ["https://e-commerce-opal-seven.vercel.app"]
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
    app.use(cors()) // allow any origin
    app.use(express.json())
    connectDB()
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/task', taskRouter)
    app.all("*", (req, res, next) => { next(new Error("End Point Not Found", { cause: 404 })) })
    app.use(globalErrorHandler)
}
export default appRouter