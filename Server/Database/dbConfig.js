import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();


const ConnectDB = async()=>{
    try {
        const mongoURL = process.env.MONGODBCONNECTIONSTRING
    const connection = await mongoose.connect(mongoURL)

    console.log('Connected Succesfully MongoDB');
    return connection;

    } catch (error) {
         console.error("Error connection", error)
    }
    
}

export default ConnectDB

