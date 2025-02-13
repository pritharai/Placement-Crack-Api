import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
// app.use(express.json());


dotenv.config({
  path: './.env',
});

const connectDB = async () => {
  try {
      const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
      console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
      console.error("Error connecting to MongoDB", error);
      process.exit(1); // Exit with failure
  }
};
connectDB()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

console.log("dss");
