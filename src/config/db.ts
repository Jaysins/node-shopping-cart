import mongoose from 'mongoose';
import settings from './settings';


const connectDB = async (): Promise<void> => {
    try{
        await mongoose.connect(settings.MONGO_URI);

          console.log("Connected to Mongo=>");
    }catch(error) {
        console.error('Connection failed', error);
    }
}

export default connectDB;