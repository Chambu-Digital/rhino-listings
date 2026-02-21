import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/service.js';

dotenv.config();

const services = [
  {
    name: "Truck Bed Liners",
    description: "Industry-leading spray-on bedliners engineered to protect your truck bed from the toughest conditions. Our polyurethane and polyurea coatings provide unmatched protection.",
    category: "Vehicle Coating",
    features: [
      "Impact & abrasion resistance",
      "Watertight seal prevents rust",
      "UV & chemical resistant",
      "Custom colors & textures",
      "Non-slip surface",
      "Lifetime warranty available"
    ],
    basePrice: 25000,
    priceUnit: "per_vehicle",
    estimatedDuration: "3-4 hours",
    imageUrl: "/images/vehicle-before-after.jpg",
    isActive: true
  },
  {
    name: "Industrial Coatings",
    description: "Heavy-duty protective coatings designed for the harshest industrial environments and equipment. Protect your machinery and infrastructure from wear, chemicals, and corrosion.",
    category: "Industrial",
    features: [
      "Extreme durability",
      "Chemical & corrosion resistant",
      "Temperature resistant",
      "Fast application & cure",
      "Reduces downtime",
      "Easy to clean & maintain"
    ],
    basePrice: 50000,
    priceUnit: "per_sqm",
    estimatedDuration: "1-2 days",
    imageUrl: "/images/industrial-coating.jpg",
    isActive: true
  },
  {
    name: "Vehicle Protection Package",
    description: "Comprehensive vehicle protection that goes beyond bed liners to safeguard your entire vehicle. From rocker panels to undercarriage, we protect every vulnerable area.",
    category: "Vehicle Coating",
    features: [
      "Stone chip prevention",
      "Corrosion protection",
      "Sound dampening",
      "Seamless application",
      "Long-lasting finish",
      "Easy maintenance"
    ],
    basePrice: 35000,
    priceUnit: "per_vehicle",
    estimatedDuration: "4-6 hours",
    imageUrl: "/images/custom-sprayon.jpg",
    isActive: true
  },
  {
    name: "Commercial Floor Coating",
    description: "Durable coatings for commercial and architectural surfaces including parking structures, loading areas, and high-traffic floors.",
    category: "Commercial",
    features: [
      "High traffic durability",
      "Slip resistant",
      "Chemical resistant",
      "Easy maintenance",
      "Custom colors available",
      "Fast installation"
    ],
    basePrice: 60000,
    priceUnit: "per_sqm",
    estimatedDuration: "2-3 days",
    imageUrl: "/images/industrial-coating.jpg",
    isActive: true
  },
  {
    name: "Custom Spray-On Solutions",
    description: "Tailored protective coatings for unique applications including marine, agricultural, and specialty surfaces. Custom formulations available.",
    category: "Custom",
    features: [
      "Custom formulations",
      "Versatile applications",
      "Weather resistant",
      "Impact protection",
      "Long-lasting durability",
      "Professional consultation"
    ],
    basePrice: 40000,
    priceUnit: "fixed",
    estimatedDuration: "Varies",
    imageUrl: "/images/custom-sprayon.jpg",
    isActive: true
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing services');

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log(`✅ Successfully seeded ${createdServices.length} services:`);
    
    createdServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} - KSh ${service.basePrice.toLocaleString()}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedServices();
