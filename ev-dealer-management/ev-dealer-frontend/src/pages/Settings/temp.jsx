<TabPanel value={activeTab} index={1}>
  <Grid container spacing={4}>
    <Grid item xs={12} md={8}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
      >
        <Key sx={{ mr: 2, verticalAlign: "middle" }} />
        Quản lý bảo mật
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và
        ký tự đặc biệt.
      </Alert>

      <form onSubmit={handlePasswordSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mb: 4,
          }}
        >
          <TextField
            name="currentPassword"
            type="password"
            label="Mật khẩu hiện tại"
            fullWidth
            variant="outlined"
            size="medium"
            required
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
          <TextField
            name="newPassword"
            type="password"
            label="Mật khẩu mới"
            fullWidth
            variant="outlined"
            size="medium"
            required
            InputProps={{
              startAdornment: <Key sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
          <TextField
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            fullWidth
            variant="outlined"
            size="medium"
            required
            InputProps={{
              startAdornment: <Key sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isSubmitting}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Button>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Hủy bỏ
          </Button>
        </Box>
      </form>
    </Grid>

    <Grid item xs={12} md={4}>
      <Card
        sx={{
          bgcolor: "error.lighter",
          color: "error.dark",
          mb: 2,
          border: 1,
          borderColor: "error.light",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            🛡️ Lưu ý bảo mật
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Đổi mật khẩu định kỳ 3 tháng/lần
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Không sử dụng mật khẩu cũ
          </Typography>
          <Typography variant="body2">
            • Bật xác thực 2 yếu tố nếu có
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ border: `1px solid ${theme.palette.divider}`, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Lịch sử bảo mật
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Lần đổi mật khẩu cuối:</Typography>
              <Typography variant="body2" fontWeight={600}>
                1 tuần trước
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Trạng thái 2FA:</Typography>
              <Chip label="Chưa kích hoạt" color="warning" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">Thiết bị đăng nhập:</Typography>
              <Typography variant="body2" fontWeight={600}>
                2 thiết bị
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          backgroundColor: "action.hover",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          <Security sx={{ mr: 1, verticalAlign: "middle" }} />
          Xác thực hai yếu tố (2FA)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Bảo vệ tài khoản của bạn bằng cách kích hoạt xác thực hai yếu tố
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Security />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Thiết lập xác thực 2FA
        </Button>
      </Box>
    </Grid>
  </Grid>
</TabPanel>;
