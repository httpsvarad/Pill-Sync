import mongoose from "mongoose";

const connectDb = async () => {
    const connstring = process.env.MONGO_URI
    try {

        await mongoose.connect(connstring);
        console.log('connected to database');
    } catch (error) {
        console.log('error connecting:', error);

    }
}

export default connectDb; 