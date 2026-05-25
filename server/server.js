import express from "express"    
import cors from "cors"        
import dotenv from "dotenv"
dotenv.config()  
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import connectDB from "./config/db.js"
import verifyRouter from "./route/verifyHandles.route.js"
import userRouter from "./route/user.route.js"
import potdRouter from "./route/potd.route.js"
import contestRouter from "./route/contest.route.js"
import uploadRouter from "./route/upload.route.js"
import eventRouter from "./route/event.route.js"

const app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL    //url of frontend
}))
//console.log("CORS enabled for", process.env.FRONTEND_URL)
app.use(express.json())    //all request will be in json format
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy : false   //allow request from any domain
}))

const PORT = process.env.PORT || 8080

app.get("/", (request, response) => {
    //server to client
    response.json({
        message: "Server is running " + PORT
    })
})

app.use('/api', async (request, response, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        next(error)
    }
})

app.use('/api/verify', verifyRouter)
app.use('/api/user', userRouter) 
app.use('/api/potd', potdRouter)
app.use('/api/contest', contestRouter)
app.use("/api/file", uploadRouter)
app.use('/api/event', eventRouter)

app.use((error, request, response, next) => {
    console.error(error)
    response.status(500).json({
        success: false,
        error: true,
        message: error.message || "Internal Server Error"
    })
})

if (!process.env.VERCEL) {
    connectDB().then(()=>{
        app.listen(PORT,()=>{
            console.log("Server is running ",PORT)
        })
    }).catch((error) => {
        console.error("Failed to start server", error)
        process.exit(1)
    })
}

export default app
