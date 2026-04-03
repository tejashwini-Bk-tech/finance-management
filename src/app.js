import express from "express"
import { router } from "./routes/authRoute.js"
import { testrouter } from "./routes/testRoute.js"
const app = express()

app.use(express.json())
app.use('/api/auth',router)
app.use('/api/test',testrouter)
app.get("/",(req,res)=>{
    res.send("API is running")
})


export default app