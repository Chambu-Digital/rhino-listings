export const getQuotation = async (req, res) => {
  try {
    res.json({ message: 'Get quotation - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting quotation', error: error.message });
  }
};

export const createQuotation = getQuotation;

export const listQuotations = async (req, res) => {
  try {
    res.json({ message: 'List quotations - to be implemented', quotations: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotations', error: error.message });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    res.json({ message: 'Get quotation by ID - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotation', error: error.message });
  }
};
