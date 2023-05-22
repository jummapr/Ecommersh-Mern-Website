import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connection.host}`);
      } catch (error) {
          console.log("Some Error: ", error);
          process.exit(1);
      }
}

export default connectDB