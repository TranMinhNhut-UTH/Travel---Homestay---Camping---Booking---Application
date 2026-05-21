import axios from "axios";

// Create axios instance
// Use API Gateway (port 5036) as default, which routes to all microservices
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5036/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      console.log("API Error Response Data:", data); // Add this line for debugging

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Avoid an infinite reload loop if the app is already on the login page
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }

      // Keep the error response structure so frontend can access error.response.data.message
      const errorWithResponse = new Error(data.message || data.Message || "An error occurred");
      errorWithResponse.response = error.response;
      return Promise.reject(errorWithResponse);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error("Network error. Please check your connection."));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  },
);

export default api;
