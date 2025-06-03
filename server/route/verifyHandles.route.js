import { Router } from "express"
import { verifyCodeforcesController, verifyLeetCodeController, sendOTPController, verifyOTPController } from "../controllers/verifyHandles.controller.js"

const verifyRouter = Router()

verifyRouter.post('/codeforces', verifyCodeforcesController)
verifyRouter.post('/leetcode', verifyLeetCodeController)
verifyRouter.post('/send-otp', sendOTPController);
verifyRouter.post('/verify-otp', verifyOTPController);

export default verifyRouter
