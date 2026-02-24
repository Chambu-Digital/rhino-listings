export const getVehicleTypes = async (req, res) => {
  try {
    const types = ['Pickup Truck', 'SUV', 'Van', 'Commercial Vehicle'];
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle types', error: error.message });
  }
};

export const getBrandsByType = async (req, res) => {
  try {
    const brands = ['Toyota', 'Nissan', 'Mitsubishi', 'Isuzu', 'Ford', 'Chevrolet', 'Mercedes-Benz', 'Volkswagen'];
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};

export const getVehicleMakes = getBrandsByType;

export const getModelsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const models = {
      'Toyota': ['Hilux', 'Land Cruiser', 'Prado', 'Fortuner'],
      'Nissan': ['Navara', 'Patrol', 'X-Trail'],
      'Mitsubishi': ['L200', 'Pajero', 'Shogun'],
      'Isuzu': ['D-Max', 'MU-X'],
      'Ford': ['Ranger', 'F-150'],
      'Chevrolet': ['Silverado', 'Colorado']
    };
    res.json(models[brand] || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle models', error: error.message });
  }
};

export const getModelsByMake = getModelsByBrand;

export const getYearsByModel = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 20; year--) {
      years.push(year);
    }
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching years', error: error.message });
  }
};
