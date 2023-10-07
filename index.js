import appRouter from './src/app.router.js'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve('./Config/.env') })
const app = express()
const port = process.env.PORT || 5000
appRouter(express, app)   // init App
app.listen(port, () => console.log(`Example app listening on port ${port}!`))