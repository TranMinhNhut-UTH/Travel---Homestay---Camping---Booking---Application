import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { PageHeader } from "../../components/common";
import { complaintService } from "../../services/complaintService";
import { customerService } from "../../services/customerService";
import { COMPLAINT_TYPES } from "../../constants/complaintTypes"; // Import COMPLAINT_TYPES

const ComplaintNew = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, customerName } = location.state || {};

  const [complaintData, setComplaintData] = useState({
    customerId: customerId || "",
    title: "",
    description: "",
    type: "GENERAL", // Default type should match a key in COMPLAINT_TYPES
    status: "Open",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);

  useEffect(() => {
    if (!customerId) {
      const fetchCustomers = async () => {
        try {
          const response = await customerService.getCustomers();
          setCustomerOptions(response.map(cust => ({ id: cust.id, name: cust.name })));
        } catch (err) {
          console.error("Failed to fetch customers:", err);
          setError("Failed to load customer list.");
        }
      };
      fetchCustomers();
    } else {
      setComplaintData(prevData => ({
        ...prevData,
        customerId: customerId,
      }));
    }
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCustomerSelect = (e) => {
    const selectedCustomerId = e.target.value;
    setComplaintData((prevData) => ({
      ...prevData,
      customerId: selectedCustomerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...complaintData,
      customerId: parseInt(complaintData.customerId, 10),
    };

    try {
      await complaintService.createComplaint(payload);
      setSuccess(true);
      navigate("/complaints", { state: { refresh: true } });
    } catch (err) {
      setError("Failed to submit complaint. Please try again.");
      console.error("Complaint submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Khiếu nại", href: "/complaints" },
    { label: "Tạo khiếu nại mới", href: "/complaints/new" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PageHeader
        title="Tạo khiếu nại mới"
        subtitle="Điền thông tin chi tiết về khiếu nại"
        breadcrumbs={breadcrumbs}
      />

      <Container maxWidth="md" sx={{ flex: 1, mt: 3, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, elevation: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Khiếu nại đã được tạo thành công!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Khách hàng"
              name="customerId"
              value={customerId ? customerName : complaintData.customerId}
              onChange={handleCustomerSelect}
              margin="normal"
              required
              disabled={!!customerId}
              select={!customerId && customerOptions.length > 0}
              SelectProps={{
                onChange: handleCustomerSelect,
                value: complaintData.customerId,
              }}
              sx={{ mb: 2 }}
            >
              {!customerId && customerOptions.length > 0 && (
                customerOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              fullWidth
              label="Tiêu đề khiếu nại"
              name="title"
              value={complaintData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mô tả chi tiết"
              name="description"
              value={complaintData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Loại khiếu nại"
              name="type"
              value={complaintData.type}
              onChange={handleChange}
              margin="normal"
              select
              required
              sx={{ mb: 2 }}
            >
              {Object.entries(COMPLAINT_TYPES).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/complaints")}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Gửi khiếu nại"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ComplaintNew;
