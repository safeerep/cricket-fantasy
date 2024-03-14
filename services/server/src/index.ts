import { config } from "dotenv"
config()

import express, { Express, Request, Response } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"

const app: Express = express()

const CLIENT_URL = process.env.CLIENT_URL;
const corsOptions = {
    origin: CLIENT_URL,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true
}
const sessionOptions = {
    secret: String(process.env.SESSION_SECRET),
    resave: true,
    saveUninitialized: true
}
app.use(cors(corsOptions))
app.use(session(sessionOptions))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req: Request, res: Response) => {
    res.send({ "message": "server' is running fine"})
})

app.use('/api/v1/user')

const PORT = process.env.PORT || 3333;
app.listen( PORT, () => {
    console.log(`server running successfully at the port ${PORT}`);
})