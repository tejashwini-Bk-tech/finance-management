import express from "express"
import { router } from "./routes/authRoute.js"
import { testrouter } from "./routes/testRoute.js"
import { Router } from "./routes/recordRoute.js"
import { dashboardRouter } from "./routes/dashboardRoute.js"
import { userRouter } from "./routes/userRoute.js"
const app = express()

app.use(express.json())
app.use('/api/auth', router)
app.use('/api/test', testrouter)
app.use('/api/records', Router)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/users', userRouter)

app.get("/", (req, res) => {
    res.send("API is running")
})

export default app