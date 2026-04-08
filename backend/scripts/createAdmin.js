// Script to create an admin account
// Usage: node scripts/createAdmin.js <email> <password> <name>
// Example: node scripts/createAdmin.js admin@rhinolinings.com MyPassword123 "Admin User"

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from '../models/user.js';

// Fix for Windows DNS resolution
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

dotenv.config();

const [,, email, password, name = 'Admin User'] = process.argv;

if (!email || !password) {
  console.error('❌ Usage: node scripts/createAdmin.js <email> <password> [name]');
  console.error('   Example: node scripts/createAdmin.js admin@rhinolinings.com MyPassword123 "Admin User"');
  process.exit(1);
}

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log(`❌ User with email "${email}" already exists!`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword, role: 'admin' });

    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role: Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
