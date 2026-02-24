export const generateDocument = async (req, res) => {
  try {
    res.json({ message: 'Generate document - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating document', error: error.message });
  }
};
