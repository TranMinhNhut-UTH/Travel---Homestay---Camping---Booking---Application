import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Alert,
  Paper,
  Typography,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import { customerService } from "../../services/customerService";

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await customerService.getCustomerById(id);
        setInitialData(response); // ✅ FIX
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load customer data.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (customerData) => {
    setLoading(true);
    try {
      await customerService.updateCustomer(id, customerData);
      setSnackbar({
        open: true,
        message: "Customer updated successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/customers");
      }, 1500);
    } catch (error) {
      console.error("Error updating customer:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update customer.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) navigate("/customers");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!initialData) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">Could not load customer data for editing.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Edit Customer
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={initialData}
          loading={loading}
          isEdit={true}
        />
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerEdit;
