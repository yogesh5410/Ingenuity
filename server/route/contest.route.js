import { Router } from "express"
import { getContests } from "../controllers/contest.controller.js"

const contestRouter = Router()

// Route to fetch upcoming contests
contestRouter.get("/upcoming", getContests)

export default contestRouter
