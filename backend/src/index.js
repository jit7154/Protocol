// import express from "express";
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser'
// import cors from "cors"

// import authRoutes from "./routes/auth.route.js"
// import messageRoutes from "./routes/message.route.js"
// import {connectDB} from "./lib/db.js"

// const app = express()
// dotenv.config()


// const PORT=process.env.PORT

// app.use(express.json())
// app.use(cookieParser())
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true,
// }))
// app.use('/api/auth',authRoutes);
// app.use('/api/message',messageRoutes);

// app.listen(PORT,()=>{
//     console.log("Server is running on PORT "+PORT);
//     connectDB()
// });
import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import bodyParser from 'body-parser'; // Import body-parser

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";


import {app,server} from "./lib/socket.js"


// const app = express();
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve()

// Increase the limit for JSON and URL-encoded payloads (This is done so that user can upload large size profile pics)
app.use(bodyParser.json({ limit: '5mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true })); // Adjust limit as needed

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
    
}

server.listen(PORT, () => {
    console.log("Server is running on PORT " + PORT);
    connectDB();
});