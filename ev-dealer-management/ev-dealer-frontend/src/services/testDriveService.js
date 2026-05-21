import api from "./api";

const BASE_URL = "TestDrives"; // Corrected: Should be just "TestDrives" to match API Gateway route

const testDriveService = {
  getAllTestDrives: async () => {
    return await api.get(BASE_URL);
  },

  getTestDriveById: async (id) => {
    return await api.get(`${BASE_URL}/${id}`);
  },

  getTestDrivesByCustomerId: async (customerId) => {
    return await api.get(`${BASE_URL}/customer/${customerId}`);
  },

  createTestDrive: async (testDriveData) => {
    return await api.post(BASE_URL, testDriveData);
  },

  updateTestDriveStatus: async (id, status) => {
    return await api.put(`${BASE_URL}/${id}/status`, status, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  updateTestDrive: async (id, testDriveData) => {
    return await api.put(`${BASE_URL}/${id}`, testDriveData);
  },

  deleteTestDrive: async (id) => {
    return await api.delete(`${BASE_URL}/${id}`);
  },
};

export default testDriveService;
