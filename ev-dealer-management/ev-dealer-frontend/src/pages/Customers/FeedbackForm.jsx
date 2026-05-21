import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/common";
import { customerService } from "../../services/customerService"; // Vẫn cần để lấy tên khách hàng
import complaintService from "../../services/complaintService";

const ComplaintForm = () => { // Đổi tên thành ComplaintForm
  const navigate = useNavigate();
  const { customerId, complaintId } = useParams(); // Lấy customerId và complaintId
  const [customerName, setCustomerName] = useState(""); // State để lưu tên khách hàng
  const [formData, setFormData] = useState({
    customerId: parseInt(customerId), // Gán customerId từ URL
    subject: "",
    description: "",
    status: "Open",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin khách hàng để hiển thị tên
        const customerData = await customerService.getCustomerById(customerId);
        setCustomerName(customerData.name);

        if (complaintId) { // Nếu là chỉnh sửa khiếu nại
          const data = await complaintService.getComplaintById(complaintId);
          setFormData({
            customerId: data.customerId,
            subject: data.subject,
            description: data.description,
            status: data.status,
          });
        }
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId, complaintId]); // Thêm complaintId vào dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (complaintId) {
        await complaintService.updateComplaint(complaintId, formData);
      } else {
        await complaintService.createComplaint(formData);
      }
      alert("Khiếu nại đã được lưu thành công!");
      navigate(`/customers/${customerId}`); // Điều hướng về trang chi tiết khách hàng
    } catch (err) {
      setError("Failed to save complaint. Please try again.");
      console.error("Error submitting complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Khách hàng", href: "/customers" },
    { label: customerName, href: `/customers/${customerId}` },
    { label: complaintId ? "Chỉnh sửa khiếu nại" : "Tạo khiếu nại mới" },
  ];

  return (
    <Container maxWidth="md">
      <PageHeader
        title={complaintId ? "Chỉnh sửa khiếu nại" : "Tạo khiếu nại mới"}
        breadcrumbs={breadcrumbs}
      />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Khách hàng"
            name="customerName"
            value={customerName} // Hiển thị tên khách hàng
            fullWidth
            margin="normal"
            disabled // Không cho phép chỉnh sửa
          />
          <TextField
            label="Tiêu đề"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          {complaintId && ( // Chỉ hiển thị trạng thái khi chỉnh sửa
            <TextField
              select
              label="Trạng thái"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="Open">Mở</MenuItem>
              <MenuItem value="In Progress">Đang xử lý</MenuItem>
              <MenuItem value="Resolved">Đã giải quyết</MenuItem>
              <MenuItem value="Closed">Đã đóng</MenuItem>
            </TextField>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {complaintId ? "Cập nhật" : "Gửi khiếu nại"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ComplaintForm;