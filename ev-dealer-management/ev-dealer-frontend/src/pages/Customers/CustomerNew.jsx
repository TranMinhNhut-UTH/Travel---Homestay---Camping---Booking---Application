import React, { useState } from "react";
import {
  Container,
  Box,
  Alert,
  Paper,
  Typography,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm"; // Corrected import path
import { customerService } from "../../services/customerService";

const CustomerNew = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (customerData) => {
    setLoading(true);
    try {
      await customerService.createCustomer(customerData);
      setSnackbar({
        open: true,
        message: "Customer created successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/customers", { state: { refresh: true } });
      }, 1500);
    } catch (error) {
      console.error("Error creating customer:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create customer.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      navigate("/customers");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Create New Customer
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEdit={false}
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

export default CustomerNew;
