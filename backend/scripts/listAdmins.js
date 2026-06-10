import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from '../models/user.js';

if (process.platform === 'win32') dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const listAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const admins = await User.find({ role: 'admin' }).select('name email role createdAt');
    
    if (admins.length === 0) {
      console.log('❌ No admin accounts found.');
    } else {
      console.log(`Found ${admins.length} admin(s):\n`);
      admins.forEach((a, i) => {
        console.log(`${i + 1}. Name: ${a.name}`);
        console.log(`   Email: ${a.email}`);
        console.log(`   Created: ${a.createdAt}\n`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listAdmins();
