import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const CustomerForm = ({ initialData = {}, onSubmit, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: '',
    joinDate: dayjs(),
    ...initialData,
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      ...initialData,
      joinDate: initialData.joinDate ? dayjs(initialData.joinDate) : dayjs(),
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      joinDate: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      joinDate: formData.joinDate.toISOString(), // Convert dayjs object to ISO string
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Tên khách hàng"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Trạng thái"
                onChange={handleChange}
              >
                <MenuItem value="">Chọn trạng thái</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
                <MenuItem value="pending">Đang chờ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Ngày tham gia"
              value={formData.joinDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onCancel} sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Cập nhật' : 'Thêm khách hàng'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CustomerForm;