import express from "express"
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// middlewares
app.use(express.json())
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
}))

// api endpoints
app.use("/api/user/login", authLimiter)
app.use("/api/user/register", authLimiter)
app.use("/api/admin/login", authLimiter)
app.use("/api/doctor/login", authLimiter)
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))