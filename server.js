import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({quiet:true});
const app = express();

//middleware to parse json
app.use(express.json());


//routes
app.use("/api/user", userRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connected");
    app.listen(process.env.PORT, ()=>
        console.log(`Server is running on port ${process.env.PORT}`)
    );
})
.catch(err => cosnole.log(err));