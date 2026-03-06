import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Hero Banner'
  },
  videoUrl: {
    type: String,
    required: false,
    default: ''
  },
  videoType: {
    type: String,
    enum: ['url', 'base64'],
    default: 'url'
  },
  fallbackImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bannerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
