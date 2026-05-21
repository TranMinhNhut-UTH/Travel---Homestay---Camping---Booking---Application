import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  DirectionsCar as CarIcon,
  ShoppingCart as ShoppingIcon,
  Engineering as EngineeringIcon,
  Search as SearchIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import { PageHeader, DataTable } from "../../components/common";
import { customerService } from "../../services/customerService";
import testDriveService from "../../services/testDriveService";
import { format } from "date-fns";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerTestDrives, setCustomerTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const customerResponse = await customerService.getCustomerById(id);
        setCustomer(customerResponse);

        const testDrivesResponse = await testDriveService.getTestDrivesByCustomerId(id);
        setCustomerTestDrives(testDrivesResponse);

        setError(null);
      } catch (err) {
        setError("Failed to fetch customer details or test drives.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const purchaseHistory = [];
  const serviceHistory = [];

  const columns = [
    { field: "date", headerName: "Ngày", width: 120 },
    { field: "vehicle", headerName: "Xe", width: 200 },
    { field: "amount", headerName: "Số tiền", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
  ];

  const testDriveColumns = [
    {
      field: "appointmentDate",
      headerName: "Ngày hẹn",
      width: 180,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy HH:mm"),
    },
    { field: "vehicleId", headerName: "ID Xe", width: 100 },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "notes", headerName: "Ghi chú", width: 200 },
  ];

  const serviceColumns = [
    { field: "date", headerName: "Ngày", width: 120 },
    { field: "service", headerName: "Dịch vụ", width: 200 },
    { field: "amount", headerName: "Chi phí", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 120 },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const breadcrumbs = [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Khách hàng", href: "/customers" },
    { label: "Chi tiết khách hàng", href: `/customers/${id}` },
  ];

  const pageActions = [
    {
      label: "Chỉnh sửa",
      icon: <EditIcon />,
      variant: "outlined",
      color: "primary",
      onClick: () => navigate(`/customers/${id}/edit`),
    },
    {
      label: "Đặt lịch test drive",
      icon: <CarIcon />,
      variant: "contained",
      color: "primary",
      onClick: () => navigate("/customers/test-drive/new", { state: { customer } }),
    },
    {
      label: "Tạo khiếu nại",
      icon: <FeedbackIcon />,
      variant: "contained",
      color: "secondary",
      onClick: () => navigate(`/complaints/new`, { state: { customerId: id, customerName: customer.name } }),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="warning">No customer data found.</Alert>
      </Container>
    );
  }

  const stats = [
    {
      icon: <ShoppingIcon />,
      value: customer.purchases?.length || 0,
      label: "Tổng mua hàng",
      color: "primary.main",
    },
    {
      icon: <CarIcon />,
      value: customerTestDrives?.length || 0,
      label: "Lần test drive",
      color: "info.main",
    },
    {
      icon: <EngineeringIcon />,
      value: "N/A",
      label: "Lịch sử dịch vụ",
      color: "warning.main",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PageHeader
        title={`${customer.name} - Chi tiết khách hàng`}
        subtitle="Thông tin chi tiết và lịch sử mua hàng"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
        stats={stats}
      />

      <Container maxWidth="xl" sx={{ flex: 1, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3, elevation: 3 }}> {/* Added elevation */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    mr: 2,
                    flexShrink: 0, // Prevent avatar from shrinking
                  }}
                >
                  {customer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}> {/* Adjusted margin */}
                    {customer.name}
                  </Typography>
                  <Chip
                    label={customer.status || "N/A"}
                    color={customer.status === "Active" ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Box>

              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}> {/* Adjusted minWidth for icon alignment */}
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={customer.email} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Số điện thoại"
                    secondary={customer.phone || "N/A"}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Địa chỉ"
                    secondary={customer.address || "N/A"}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ngày tham gia"
                    secondary={
                      customer.joinDate
                        ? format(new Date(customer.joinDate), "dd/MM/yyyy")
                        : "N/A"
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 3, elevation: 3 }}> {/* Added elevation */}
              <TextField
                fullWidth
                placeholder="Tìm kiếm trong lịch sử..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            <Paper sx={{ borderRadius: 3, elevation: 3 }}> {/* Added elevation */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}
                centered
              >
                <Tab label="Lịch sử mua hàng" icon={<ShoppingIcon />} />
                <Tab label="Test Drive" icon={<CarIcon />} />
                <Tab label="Lịch sử dịch vụ" icon={<EngineeringIcon />} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <DataTable
                    columns={columns}
                    data={purchaseHistory}
                    pagination={true}
                  />
                )}
                {tabValue === 1 && (
                  <DataTable
                    columns={testDriveColumns}
                    data={customerTestDrives}
                    pagination={true}
                  />
                )}
                {tabValue === 2 && (
                  <DataTable
                    columns={serviceColumns}
                    data={serviceHistory}
                    pagination={true}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
        <DialogContent>
          <Typography>Form chỉnh sửa sẽ được thêm vào đây...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetail;
