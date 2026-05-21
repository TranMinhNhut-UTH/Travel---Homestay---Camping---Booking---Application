import api from './api';

const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data?.message || 'An error occurred while fetching users.';
    }
  },

  approveUser: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/approve`);
      return response;
    } catch (error) {
      console.error('Error approving user:', error);
      throw error.response?.data?.message || 'An error occurred while approving the user.';
    }
  },

  rejectUser: async (userId) => {
    try {
      // This will call the DELETE /api/users/{id} endpoint
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw error.response?.data?.message || 'An error occurred while rejecting the user.';
    }
  },

  // New method to create an approved user
  createApprovedUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response;
    } catch (error) {
      console.error('Error creating approved user:', error);
      throw error; // Throw the full error object for more detailed handling in UI
    }
  },

  // New method to get dealers
  getDealers: async () => {
    try {
      const response = await api.get('/dealers');
      return response.data; // Assuming the API returns an array of dealers directly
    } catch (error) {
      console.error('Error fetching dealers:', error);
      throw error.response?.data?.message || 'An error occurred while fetching dealers.';
    }
  },
};

export default adminService;
