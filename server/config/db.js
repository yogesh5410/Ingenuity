import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

let connectionPromise

const connectDB = async () => {
    if(!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not defined")
    }

    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection
    }

    if (connectionPromise) {
        return connectionPromise
    }

    try {
        connectionPromise = mongoose.connect(process.env.MONGODB_URL).then((mongooseInstance) => {
            console.log("Database connected")
            return mongooseInstance.connection
        })

        return await connectionPromise
    } catch (error) {
        connectionPromise = undefined
        console.log("MongoDB connection error", error)
        throw error
    }
}

export default connectDB
