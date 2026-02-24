import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Service from '../models/service.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const services = [
  {
    name: "Truck Bed Liners",
    description: "Custom spray-on bed liners fitted to each vehicle's unique contours. 100% polyurethane providing the ultimate protection against rust, corrosion and impact. Ready same day.",
    category: "Vehicle Coating",
    basePrice: 25000,
    priceUnit: "fixed",
    estimatedDuration: "2–4 hours",
    features: [
      "Custom fit to vehicle contours",
      "100% polyurethane protection",
      "Rust and corrosion resistant",
      "Impact protection",
      "Same day service"
    ],
    imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80",
    isActive: true
  },
  {
    name: "Industrial Coatings",
    description: "Heavy-duty coatings for cement trucks, acid bunds, dump trucks, refuse skips and steel structures. Adheres to steel, fibreglass, concrete, wood and aluminium.",
    category: "Industrial",
    basePrice: 50000,
    priceUnit: "fixed",
    estimatedDuration: "1–2 days",
    features: [
      "Heavy-duty protection",
      "Multi-substrate adhesion",
      "Chemical resistant",
      "Long-lasting durability",
      "Industrial grade"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    isActive: true
  },
  {
    name: "Mining Applications",
    description: "Proven in the harshest mining environments worldwide. Protects chutes, hoppers, pulleys, conveyor belts and vehicles — reducing unplanned downtime and extending asset lifespan.",
    category: "Mining",
    basePrice: 80000,
    priceUnit: "custom",
    estimatedDuration: "Custom",
    features: [
      "Extreme environment protection",
      "Reduces downtime",
      "Extends asset lifespan",
      "Abrasion resistant",
      "Proven worldwide"
    ],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    isActive: true
  },
  {
    name: "Marine Protection",
    description: "Industrial-grade protection for ski boats, fishing boats, yachts, commercial and navy ships. Seamless hygienic linings resistant to fuel, salt and corrosive elements.",
    category: "Marine",
    basePrice: 40000,
    priceUnit: "fixed",
    estimatedDuration: "1–2 days",
    features: [
      "Saltwater resistant",
      "Fuel resistant",
      "Seamless hygienic lining",
      "Corrosion protection",
      "Marine grade"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    isActive: true
  },
  {
    name: "Waterproofing Solutions",
    description: "Seamless elastomer coatings for rooftops, parking lots, bathrooms, balconies and retaining walls. Flexible, rapid installation and can be tiled over.",
    category: "Waterproofing",
    basePrice: 30000,
    priceUnit: "per_sqm",
    estimatedDuration: "1 day",
    features: [
      "Seamless application",
      "Flexible coating",
      "Rapid installation",
      "Can be tiled over",
      "Long-term protection"
    ],
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    isActive: true
  },
  {
    name: "Containment Solutions",
    description: "Primary and secondary containment for tanks and bund areas above and below ground. Zero permeability polyurea lasting 60+ years without maintenance.",
    category: "Containment",
    basePrice: 60000,
    priceUnit: "custom",
    estimatedDuration: "Custom",
    features: [
      "Zero permeability",
      "60+ year lifespan",
      "No maintenance required",
      "Above and below ground",
      "Primary and secondary containment"
    ],
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80",
    isActive: true
  },
  {
    name: "Vehicle Full Body Protection",
    description: "Complete vehicle protection with spray-on polyurethane coating. Protects against stone chips, scratches, and environmental damage while maintaining vehicle aesthetics.",
    category: "Vehicle Coating",
    basePrice: 45000,
    priceUnit: "fixed",
    estimatedDuration: "1 day",
    features: [
      "Full body coverage",
      "Stone chip protection",
      "Scratch resistant",
      "UV protection",
      "Maintains aesthetics"
    ],
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    isActive: true
  },
  {
    name: "Agricultural Equipment Coating",
    description: "Protective coatings for tractors, harvesters, and farm equipment. Resistant to fertilizers, pesticides, and harsh outdoor conditions.",
    category: "Agricultural",
    basePrice: 35000,
    priceUnit: "fixed",
    estimatedDuration: "1–2 days",
    features: [
      "Chemical resistant",
      "Weather resistant",
      "Equipment protection",
      "Long-lasting",
      "Easy to clean"
    ],
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    isActive: true
  },
  {
    name: "Commercial Floor Coating",
    description: "High-traffic floor coatings for warehouses, factories, and commercial spaces. Slip-resistant, easy to clean, and extremely durable.",
    category: "Commercial",
    basePrice: 60000,
    priceUnit: "per_sqm",
    estimatedDuration: "2–3 days",
    features: [
      "High-traffic rated",
      "Slip-resistant",
      "Easy maintenance",
      "Chemical resistant",
      "Fast curing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    isActive: true
  },
  {
    name: "Custom Spray-On Solutions",
    description: "Tailored protective coatings for unique applications including marine, agricultural, and specialty surfaces. Custom formulations available.",
    category: "Custom",
    basePrice: 40000,
    priceUnit: "custom",
    estimatedDuration: "Varies",
    features: [
      "Custom formulations",
      "Versatile applications",
      "Weather resistant",
      "Impact protection",
      "Long-term durability"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    isActive: true
  }
];

async function seedServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    // Insert new services
    const result = await Service.insertMany(services);
    console.log(`✅ Successfully seeded ${result.length} services`);

    // Display seeded services
    console.log('\n📋 Seeded Services:');
    result.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} - KES ${service.basePrice.toLocaleString()} (${service.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
}

seedServices();
