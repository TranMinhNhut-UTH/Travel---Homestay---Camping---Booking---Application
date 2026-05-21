import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { PageHeader, DataTable } from "../../components/common";
import testDriveService from "../../services/testDriveService";
import { format } from "date-fns";

const TestDriveList = () => {
  const navigate = useNavigate();
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDrives = async () => {
      try {
        setLoading(true);
        const response = await testDriveService.getAllTestDrives();
        setTestDrives(response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch test drives.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDrives();
  }, []);

  const columns = [
    {
      field: "appointmentDate",
      headerName: "Ngày hẹn",
      width: 180,
      renderCell: (params) => format(new Date(params.value), "dd/MM/yyyy HH:mm"),
    },
    { field: "customerName", headerName: "Tên khách hàng", width: 200 },
    { field: "vehicleId", headerName: "ID Xe", width: 100 },
    { field: "status", headerName: "Trạng thái", width: 150 },
    { field: "notes", headerName: "Ghi chú", width: 250 },
  ];

  const breadcrumbs = [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Lịch hẹn Test Drive", href: "/test-drives" },
  ];

  const pageActions = [
    {
      label: "Tạo lịch hẹn mới",
      icon: <AddIcon />,
      variant: "contained",
      color: "primary",
      onClick: () => navigate("/customers/test-drive/new"), // Navigate to the form for creating a new test drive
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PageHeader
        title="Quản lý Lịch hẹn Test Drive"
        subtitle="Danh sách tất cả các lịch hẹn lái thử"
        icon={<CarIcon />}
        breadcrumbs={breadcrumbs}
        actions={pageActions}
      />
      <Container maxWidth="xl" sx={{ mt: 3, flex: 1 }}>
        <DataTable
          columns={columns}
          data={testDrives}
          pagination={true}
          onRowClick={(params) => navigate(`/customers/${params.row.customerId}`)} // Navigate to customer detail on row click
        />
      </Container>
    </Box>
  );
};

export default TestDriveList;
