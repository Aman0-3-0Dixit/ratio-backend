import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', async () => {
    console.log('Connected to MongoDB');
    });
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;