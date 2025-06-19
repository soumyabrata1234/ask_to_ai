import mongoose  from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
   //  const url = import.meta.env.VITE_MONGODB_URL ; 
  
    const uri = process.env.URI;
    try {
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
          //  useUnifiedTopology: true,
        });
      //  console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

 export default connectDB;
