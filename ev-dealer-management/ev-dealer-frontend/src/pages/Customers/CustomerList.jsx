import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader, DataTable } from "../../components/common";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  DirectionsCar as CarIcon, // Import CarIcon
} from "@mui/icons-material";
import { format } from "date-fns";
import { customerService } from "../../services/customerService";

const CustomerList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting to fetch customers...");
      const customersData = await customerService.getCustomers();
      console.log("Customers data received:", customersData);

      setCustomers(Array.isArray(customersData) ? customersData : []);
    } catch (err) {
      console.error("Error in fetchCustomers:", err);
      setError("Failed to fetch customers. Please try again later.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [location.state]);

  const handleDeleteClick = (id) => {
    setSelectedCustomerId(id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomerId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomerId) return;

    try {
      await customerService.deleteCustomer(selectedCustomerId);
      setCustomers(customers.filter((c) => c.id !== selectedCustomerId));
      setSnackbar({ open: true, message: "Customer deleted successfully!" });
    } catch (err) {
      setError("Failed to delete customer.");
      console.error("Error deleting customer:", err);
    } finally {
      handleDialogClose();
    }
  };

  const columns = [
    { field: "name", headerName: "Khách hàng", type: "avatar", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    {
      field: "purchases",
      headerName: "Tổng mua hàng",
      type: "number",
      width: 120,
      valueGetter: (params) => params.row.purchases?.length || 0,
    },
    { field: "status", headerName: "Trạng thái", type: "status", width: 120 },
    {
      field: "joinDate",
      headerName: "Ngày tham gia",
      width: 130,
      valueGetter: (params) =>
        params.row.joinDate
          ? format(new Date(params.row.joinDate), "dd/MM/yyyy")
          : "N/A",
    },
    { field: "actions", headerName: "Thao tác", type: "actions", width: 120 },
  ];

  const actions = [
    {
      icon: <ViewIcon />,
      tooltip: "Xem chi tiết",
      onClick: (row) => navigate(`/customers/${row.id}`),
      color: "primary.main",
    },
    {
      icon: <EditIcon />,
      tooltip: "Chỉnh sửa",
      onClick: (row) => navigate(`/customers/${row.id}/edit`),
      color: "warning.main",
    },
    {
      icon: <DeleteIcon />,
      tooltip: "Xóa",
      onClick: (row) => handleDeleteClick(row.id),
      color: "error.main",
    },
  ];

  const pageActions = [
    {
      label: "Lịch Test Drive",
      icon: <CarIcon />,
      variant: "outlined",
      color: "secondary",
      onClick: () => navigate("/test-drives"),
    },
    {
      label: "Thêm khách hàng",
      icon: <AddIcon />,
      variant: "contained",
      color: "primary",
      onClick: () => navigate("/customers/new"),
    },
  ];

  const breadcrumbs = [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Quản lý khách hàng", href: "/customers" },
  ];

  const stats = [
    {
      icon: <PeopleIcon />,
      value: customers.length.toString(),
      label: "Tổng khách hàng",
      color: "primary.main",
    },
    {
      icon: <TrendingUpIcon />,
      value: "N/A",
      label: "Tăng trưởng",
      color: "success.main",
    },
    {
      icon: <ShoppingCartIcon />,
      value: "N/A",
      label: "Đơn hàng hôm nay",
      color: "warning.main",
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/customers/${row.id}`);
  };

  const handleRefresh = () => {
    fetchCustomers();
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Quản lý khách hàng"
        subtitle="Quản lý thông tin khách hàng và theo dõi hoạt động mua hàng"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
        stats={stats}
        showRefresh={true}
        onRefresh={handleRefresh}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <DataTable
          columns={columns}
          data={customers}
          searchable={true}
          pagination={true}
          selectable={true}
          actions={actions}
          onRowClick={handleRowClick}
          title="Danh sách khách hàng"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa khách hàng này không? Hành động này không
            thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default CustomerList;
