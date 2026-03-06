import Banner from '../models/Banner.js';

// Get active banner
export const getActiveBanner = async (req, res) => {
  try {
    let banner = await Banner.findOne({ isActive: true });
    
    // If no banner exists, create a default one
    if (!banner) {
      banner = await Banner.create({
        title: 'Hero Banner',
        videoUrl: '',
        videoType: 'url',
        fallbackImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80',
        isActive: true
      });
    }
    
    res.json(banner);
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({ message: 'Error fetching banner', error: error.message });
  }
};

// Get all banners
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};

// Create or update banner
export const upsertBanner = async (req, res) => {
  try {
    const { title, videoUrl, videoType, fallbackImage, isActive } = req.body;
    
    // Find active banner or create new one
    let banner = await Banner.findOne({ isActive: true });
    
    if (banner) {
      // Update existing banner
      banner.title = title || banner.title;
      banner.videoUrl = videoUrl !== undefined ? videoUrl : banner.videoUrl;
      banner.videoType = videoType || banner.videoType;
      banner.fallbackImage = fallbackImage || banner.fallbackImage;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;
      banner.updatedAt = Date.now();
      
      await banner.save();
    } else {
      // Create new banner
      banner = await Banner.create({
        title: title || 'Hero Banner',
        videoUrl: videoUrl || '',
        videoType: videoType || 'url',
        fallbackImage: fallbackImage || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&q=80',
        isActive: true
      });
    }
    
    res.json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
};

// Delete banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const banner = await Banner.findByIdAndDelete(id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
};
