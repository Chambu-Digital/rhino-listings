# Database Seeding Scripts

## Seed Services

This script populates the database with the main Rhino Linings services.

### How to Run

From the `backend` directory, run:

```bash
npm run seed:services
```

### What it does

1. Connects to MongoDB using your `.env` configuration
2. Clears all existing services from the database
3. Inserts 5 main Rhino Linings services:
   - Truck Bed Liners (KSh 25,000)
   - Industrial Coatings (KSh 50,000)
   - Vehicle Protection Package (KSh 35,000)
   - Commercial Floor Coating (KSh 60,000)
   - Custom Spray-On Solutions (KSh 40,000)

### Services Included

Each service includes:
- Name and description
- Category (Vehicle Coating, Industrial, Commercial, Custom)
- Base price and pricing unit
- List of features
- Estimated duration
- Image URL
- Active status

### Note

⚠️ This script will DELETE all existing services before adding new ones. Make sure you have a backup if you have custom services you want to keep.

### After Seeding

Once seeded, these services will automatically appear on:
- The public Services page (`/services`)
- The admin dashboard for management
- Service booking forms


---

## Migrate Customers

This script creates Customer records for existing users who registered before the automatic customer creation feature was implemented.

### How to Run

From the `backend` directory, run:

```bash
npm run migrate:customers
```

### What it does

1. Connects to MongoDB using your `.env` configuration
2. Finds all users with role 'user'
3. Checks if each user already has a Customer record
4. Creates Customer records for users who don't have them
5. Displays a summary of created, skipped, and error records

### When to Use

Run this script if:
- You have existing users who registered before the customer auto-creation feature
- The admin dashboard shows no customers even though users have registered
- You need to sync User and Customer data

### Note

✅ This script is safe to run multiple times - it will skip users who already have Customer records.

### After Migration

Once migrated, customers will appear in:
- The admin dashboard Customers page
- Customer statistics and reports
- Quotation customer information
