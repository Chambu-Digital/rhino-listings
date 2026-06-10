// Script to create an admin or superadmin account
// Usage: node scripts/createAdmin.js <email> <password> <name> [role]
// Example: node scripts/createAdmin.js admin@rhinolinings.com MyPassword123 "Admin User" admin
// Example: node scripts/createAdmin.js super@rhinolinings.com MyPassword123 "Super Admin" superadmin

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from '../models/User.js';

// Fix for Windows DNS resolution
if (process.platform === 'win32') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

dotenv.config();

const [,, email, password, name = 'Admin User', role = 'admin'] = process.argv;

if (!email || !password) {
  console.error('❌ Usage: node scripts/createAdmin.js <email> <password> [name] [role]');
  console.error('   Example: node scripts/createAdmin.js admin@rhinolinings.com MyPassword123 "Admin User" admin');
  console.error('   Example: node scripts/createAdmin.js super@rhinolinings.com MyPassword123 "Super Admin" superadmin');
  process.exit(1);
}

// Validate role
const validRoles = ['admin', 'superadmin'];
if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}. Valid roles are: ${validRoles.join(', ')}`);
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

    await User.create({ name, email, password: hashedPassword, role });

    console.log('\n✅ Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Role:', role === 'superadmin' ? 'Super Admin' : 'Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
