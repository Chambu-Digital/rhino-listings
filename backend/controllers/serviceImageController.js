import multer from 'multer';
import path from 'path';

// Use memory storage for multer (store in memory, then save to DB as base64)
const storage = multer.memoryStorage();

export const uploadServiceImage = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (reasonable for base64 storage in DB)
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const handleServiceImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    // Create data URL for the image (this will be stored in MongoDB)
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;

    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageDataUrl,
      filename: req.file.originalname,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: mimeType
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      message: 'Error uploading service image', 
      error: error.message 
    });
  }
};

export const deleteServiceImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Since images are stored as base64 in the service document,
    // deletion happens when the service is updated/deleted
    res.json({ 
      message: 'Image reference removed from service',
      filename 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error processing delete request', error: error.message });
  }
};
