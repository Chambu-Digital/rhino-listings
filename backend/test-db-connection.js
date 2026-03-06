import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Use Google's DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Host:', conn.connection.host);
    console.log('📦 Database:', conn.connection.name);
    console.log('🔌 Ready State:', conn.connection.readyState);
    
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
