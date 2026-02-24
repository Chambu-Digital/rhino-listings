import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Vehicle Coating', 'Industrial', 'Commercial', 'Custom', 'Marine', 'Mining', 'Waterproofing', 'Containment', 'Agricultural']
  },
  features: [{
    type: String
  }],
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  priceUnit: {
    type: String,
    required: true,
    enum: ['per_vehicle', 'per_sqm', 'fixed', 'per_hour', 'custom'],
    default: 'fixed'
  },
  estimatedDuration: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/images/default-service.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
