import multer from 'multer';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

// Use memory storage for multer (no local file storage)
const storage = multer.memoryStorage();

export const uploadServiceImage = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit (matching API limit)
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

    // Get API key from environment variable
    const apiKey = process.env.IMG_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Image API key not configured' });
    }

    // Create form data for external API
    const formData = new FormData();
    formData.append('media', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Optional: Add watermark for service images
    if (req.body.watermark_text) {
      formData.append('watermark_text', req.body.watermark_text);
      formData.append('watermark_position', req.body.watermark_position || 'bottom-right');
      formData.append('watermark_opacity', req.body.watermark_opacity || '0.7');
    }

    // Upload to external API
    const response = await axios.post('https://fecy.co.ke/imgapi/upload.php', formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (response.data.success) {
      res.json({ 
        message: 'Image uploaded successfully',
        imageUrl: response.data.url,
        filename: response.data.stored_name,
        originalName: response.data.original_name,
        watermarked: response.data.watermarked || false
      });
    } else {
      throw new Error(response.data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error uploading service image', 
      error: error.response?.data?.error || error.message 
    });
  }
};

export const deleteServiceImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Note: The external API doesn't provide a delete endpoint in the documentation
    // Images are stored permanently on their server
    // You may want to just remove the reference from your database
    
    res.json({ 
      message: 'Image reference removed. Note: Image remains on external server.',
      filename 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error processing delete request', error: error.message });
  }
};
