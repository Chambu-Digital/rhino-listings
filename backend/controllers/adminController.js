import User from '../models/User.js';

export const listAllRequests = async (req, res) => {
  try {
    res.json({ message: 'List all requests - to be implemented', requests: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    res.json({ message: 'Get request by ID - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error: error.message });
  }
};

export const assignRequestToEmployee = async (req, res) => {
  try {
    res.json({ message: 'Assign request - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning request', error: error.message });
  }
};

export const markRequestPaid = async (req, res) => {
  try {
    res.json({ message: 'Mark paid - to be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking paid', error: error.message });
  }
};

export const listEmployees = async (req, res) => {
  try {
    // Superadmin can see all employees including admins
    // Admin can see employees but not superadmins
    const query = req.user.role === 'superadmin'
      ? { role: { $in: ['employee', 'admin'] } }
      : { role: 'employee' };

    const employees = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ employees });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

export const listEmployeeLogins = async (req, res) => {
  try {
    res.json({ message: 'List employee logins - to be implemented', logins: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logins', error: error.message });
  }
};

export const listAdmins = async (req, res) => {
  try {
    // Only superadmin can list admins
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Superadmin only.' });
    }

    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};
