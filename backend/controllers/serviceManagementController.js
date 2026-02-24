import Service from '../models/service.js';

// @desc    Get all services
// @route   GET /api/service-management
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// @desc    Get services by category
// @route   GET /api/service-management/category/:category
// @access  Public
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.find({ category, isActive: true });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/service-management/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/service-management
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { name, description, category, features, basePrice, priceUnit, estimatedDuration, imageUrl } = req.body;
    
    const service = await Service.create({
      name,
      description,
      category,
      features,
      basePrice,
      priceUnit,
      estimatedDuration,
      imageUrl,
      isActive: true
    });
    
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/service-management/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/service-management/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

// @desc    Toggle service active status
// @route   PATCH /api/service-management/:id/toggle
// @access  Private/Admin
export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    service.isActive = !service.isActive;
    await service.save();
    
    res.json(service);
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ message: 'Error toggling service status', error: error.message });
  }
};
