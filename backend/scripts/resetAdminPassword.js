// Usage: node scripts/resetAdminPassword.js <email> <newpassword>
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
import User from '../models/user.js';

if (process.platform === 'win32') dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const [,, email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.error('Usage: node scripts/resetAdminPassword.js <email> <newpassword>');
  process.exit(1);
}

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    console.log(`✅ Password reset for ${email}`);
    console.log(`🔑 New password: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

reset();
