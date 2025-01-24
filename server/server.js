import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./connectDb/connectDb.js";

//Routes
import authRoutes from "./routes/auth.routes.js"

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
    connectDb();

});
