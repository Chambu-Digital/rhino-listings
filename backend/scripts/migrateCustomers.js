// scripts/migrateCustomers.js
// This script creates Customer records for existing users who don't have them

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Customer from '../models/customer.js';

dotenv.config();

const migrateCustomers = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find all users with role 'user'
    const users = await User.find({ role: 'user' });
    console.log(`📊 Found ${users.length} users`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Check if customer record already exists
        const existingCustomer = await Customer.findOne({ userId: user._id });
        
        if (existingCustomer) {
          console.log(`⏭️  Customer already exists for: ${user.email}`);
          skipped++;
          continue;
        }

        // Create new customer record
        await Customer.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          status: 'active'
        });

        console.log(`✅ Created customer record for: ${user.email}`);
        created++;
      } catch (err) {
        console.error(`❌ Error creating customer for ${user.email}:`, err.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📊 Total: ${users.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Migration complete. Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrateCustomers();
