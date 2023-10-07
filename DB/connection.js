import mongoose from "mongoose"
const connectDB = async () => {
    return await mongoose.connect(process.env.DB_URL).then(console.log("DB Connected............")).catch(err => console.log(`DB Is Not Connected Cuz Of ${err}`))
}
export default connectDB