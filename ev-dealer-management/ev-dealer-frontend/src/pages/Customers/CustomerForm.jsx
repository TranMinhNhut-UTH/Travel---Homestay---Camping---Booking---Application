import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const CustomerForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  loading = false,
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    status: initialData?.status || "Active",
    dealerId: initialData?.dealerId || "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "dealerId" && value !== "" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass the form data to the parent handler
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dealer ID"
            name="dealerId"
            type="number"
            value={formData.dealerId}
            onChange={handleChange}
            required
            disabled={loading}
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button variant="outlined" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : isEdit ? (
              "Update Customer"
            ) : (
              "Create Customer"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CustomerForm;
