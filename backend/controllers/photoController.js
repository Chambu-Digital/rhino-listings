import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });

export const uploadPhoto = async (req, res) => {
  try {
    res.json({ message: 'Upload photo - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
};

export const getPhotos = async (req, res) => {
  try {
    res.json({ message: 'Get photos - to be implemented', photos: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
};

export const getPhotosByBooking = async (req, res) => {
  try {
    res.json({ message: 'Get photos by booking - to be implemented', photos: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    res.json({ message: 'Delete photo - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
};
