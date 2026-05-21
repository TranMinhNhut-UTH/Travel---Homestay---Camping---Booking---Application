// src/services/complaintService.js

// URL cơ sở cho API khiếu nại của bạn
// Hãy thay thế bằng URL API thực tế của bạn
const BASE_URL = "http://localhost:5036/api/CustomerService/Complaints"; // Cập nhật BASE_URL để khớp với cấu hình API Gateway

const complaintService = {
  /**
   * Tạo một khiếu nại mới.
   * @param {Object} complaintData - Dữ liệu khiếu nại cần tạo.
   * @returns {Promise<Object>} - Dữ liệu khiếu nại đã được tạo.
   */
  createComplaint: async (complaintData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Thêm token xác thực nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tạo khiếu nại.");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi tạo khiếu nại:", error);
      throw error;
    }
  },

  /**
   * Lấy tất cả khiếu nại.
   * @returns {Promise<Array<Object>>} - Danh sách tất cả khiếu nại.
   */
  getAllComplaints: async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Thêm token xác thực nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể lấy danh sách khiếu nại.");
      }

      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy tất cả khiếu nại:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một khiếu nại theo ID.
   * @param {string} id - ID của khiếu nại.
   * @returns {Promise<Object>} - Dữ liệu khiếu nại.
   */
  getComplaintById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Thêm token xác thực nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không tìm thấy khiếu nại với ID: ${id}.`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi lấy khiếu nại với ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật một khiếu nại hiện có.
   * @param {string} id - ID của khiếu nại cần cập nhật.
   * @param {Object} updatedData - Dữ liệu cập nhật cho khiếu nại.
   * @returns {Promise<Object>} - Dữ liệu khiếu nại đã được cập nhật.
   */
  updateComplaint: async (id, updatedData) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Thêm token xác thực nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể cập nhật khiếu nại với ID: ${id}.`);
      }

      // Nếu backend trả về 204 No Content, không cố gắng phân tích JSON
      if (response.status === 204) {
        return {}; // Trả về một đối tượng rỗng hoặc null để báo hiệu thành công
      }

      return await response.json();
    } catch (error) {
      console.error(`Lỗi khi cập nhật khiếu nại với ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một khiếu nại.
   * @param {string} id - ID của khiếu nại cần xóa.
   * @returns {Promise<void>}
   */
  deleteComplaint: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Thêm token xác thực nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Không thể xóa khiếu nại với ID: ${id}.`);
      }
      // Không trả về dữ liệu cho thao tác xóa thành công
      return;
    } catch (error) {
      console.error(`Lỗi khi xóa khiếu nại với ID ${id}:`, error);
      throw error;
    }
  },
};

export { complaintService };
