import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  InputAdornment,
  Dialog, // Added
  DialogActions, // Added
  DialogContent, // Added
  DialogContentText, // Added
  DialogTitle, // Added
  Select, // Added
  MenuItem, // Added
  FormControl, // Added
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { PageHeader, DataTable } from "../../components/common";
import { complaintService } from "../../services/complaintService";
import { format } from "date-fns";
import { COMPLAINT_TYPES } from "../../constants/complaintTypes";

// Define possible complaint statuses
const COMPLAINT_STATUSES = {
  "Mới": "Mới",
  "Đang xử lý": "Đang xử lý",
  "Đã giải quyết": "Đã giải quyết",
  "Đã đóng": "Đã đóng",
  "Đã chuyển tiếp": "Đã chuyển tiếp",
};

const ComplaintListPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // Added
  const [complaintToDelete, setComplaintToDelete] = useState(null); // Added
  const [submitting, setSubmitting] = useState(false); // Added for general operations feedback
  const [success, setSuccess] = useState(null); // Added for general operations feedback


  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAllComplaints();
      console.log("Raw complaints data from API:", data); // Debugging line for raw data
      setComplaints(data);
      setError(null);
      setSuccess(null); // Clear success message on new fetch
    } catch (err) {
      setError("Không thể tải danh sách khiếu nại.");
      console.error("Lỗi khi tải khiếu nại:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteClick = (complaintId) => {
    setComplaintToDelete(complaintId);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
    setComplaintToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (complaintToDelete) {
      try {
        setSubmitting(true);
        await complaintService.deleteComplaint(complaintToDelete);
        setSuccess("Khiếu nại đã được xóa thành công!");
        fetchComplaints(); // Refresh the list
      } catch (err) {
        setError(err.message || "Không thể xóa khiếu nại.");
        console.error("Lỗi khi xóa khiếu nại:", err);
      } finally {
        setSubmitting(false);
        handleCloseDeleteConfirm();
      }
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setSubmitting(true);
      // Only update the status field
      await complaintService.updateComplaint(complaintId, { status: newStatus });
      setSuccess("Trạng thái khiếu nại đã được cập nhật thành công!");
      fetchComplaints(); // Refresh the list
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái khiếu nại.");
      console.error("Lỗi khi cập nhật trạng thái khiếu nại:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const title = complaint.title || '';
    const customerName = complaint.customerName || '';
    const type = COMPLAINT_TYPES[complaint.type] || complaint.type || '';
    const status = complaint.status || '';
    const query = searchQuery.toLowerCase();

    return (
      title.toLowerCase().includes(query) ||
      customerName.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query)
    );
  });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "customerName", headerName: "Khách hàng", width: 180 },
    { field: "title", headerName: "Tiêu đề", width: 250 },
    {
      field: "type",
      headerName: "Loại",
      width: 120,
      renderCell: (params) => {
        return COMPLAINT_TYPES[params.value] || params.value || "N/A";
      },
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value || ""}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Select status' }}
          >
            {Object.values(COMPLAINT_STATUSES).map((statusOption) => (
              <MenuItem key={statusOption} value={statusOption}>
                {statusOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 180,
      renderCell: (params) => params.value ? format(new Date(params.value), "dd/MM/yyyy HH:mm") : "N/A",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => params.row.id && navigate(`/complaints/${params.row.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row.id)}
            disabled={submitting}
          >
            Xóa
          </Button>
        </Box>
      ),
    },
  ];

  const breadcrumbs = [
    { label: "Trang chủ", href: "/dashboard" },
    { label: "Khiếu nại", href: "/complaints" },
  ];

  const pageActions = [
    {
      label: "Tạo khiếu nại mới",
      icon: <AddIcon />,
      variant: "contained",
      color: "primary",
      onClick: () => navigate("/complaints/new"),
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PageHeader
        title="Danh sách khiếu nại"
        subtitle="Quản lý tất cả các khiếu nại của khách hàng"
        breadcrumbs={breadcrumbs}
        actions={pageActions}
      />

      <Container maxWidth="xl" sx={{ flex: 1, mt: 3, mb: 4 }}>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ p: 2, borderRadius: 3, mb: 3, elevation: 3 }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm khiếu nại (tiêu đề, khách hàng, loại, trạng thái)..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Paper sx={{ borderRadius: 3, elevation: 3 }}>
          <DataTable
            columns={columns}
            data={filteredComplaints}
            pagination={true}
            pageSize={10}
            loading={submitting} // Show loading indicator when submitting
          />
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa khiếu nại?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa khiếu nại này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} disabled={submitting}>Hủy</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error" disabled={submitting}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComplaintListPage;
