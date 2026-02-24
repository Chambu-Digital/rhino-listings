import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/services/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const uploadServiceImage = multer({ storage });

export const handleServiceImageUpload = async (req, res) => {
  try {
    res.json({ message: 'Upload service image - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading service image', error: error.message });
  }
};

export const deleteServiceImage = async (req, res) => {
  try {
    res.json({ message: 'Delete service image - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service image', error: error.message });
  }
};
