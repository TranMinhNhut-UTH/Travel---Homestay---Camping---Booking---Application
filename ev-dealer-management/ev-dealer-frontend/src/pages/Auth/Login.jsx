/**
 * Login Page
 * Complete login form with validation and error handling
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import authService from "../../services/authService";
import { validateRequired } from "../../utils/validators";

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  // Fix autocomplete text color
  useEffect(() => {
    const timer = setTimeout(() => {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.style.color = "#000000";
        input.style.webkitTextFillColor = "#000000";
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [formData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.username)) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Call login API
      await authService.login(
        formData.username,
        formData.password,
        formData.rememberMe,
      );

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Extract a meaningful error message
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="on">
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 0.3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Chào Mừng Trở Lại
      </Typography>
      <Typography
        variant="caption"
        align="center"
        color="text.secondary"
        sx={{ mb: 1, display: "block" }}
      >
        Đăng nhập vào tài khoản của bạn để tiếp tục
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 0.5, py: 0.3 }}
          onClose={() => setError("")}
        >
          <Typography variant="caption" fontSize="0.75rem">
            {error}
          </Typography>
        </Alert>
      )}

      {/* Username Field */}
      <TextField
        fullWidth
        label="Tên đăng nhập"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={!!errors.username}
        helperText={errors.username}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="username"
        inputProps={{
          spellCheck: false,
          autoCorrect: "off",
          autoCapitalize: "off",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Password Field */}
      <TextField
        fullWidth
        label="Mật khẩu"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
        disabled={loading}
        margin="dense"
        size="small"
        autoComplete="current-password"
        inputProps={{
          spellCheck: false,
          autoCorrect: "off",
          autoCapitalize: "off",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Remember Me & Forgot Password */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 0.5,
          mb: 1.5,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
              size="small"
            />
          }
          label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
        />
        <Link
          to="/forgot-password"
          style={{
            textDecoration: "none",
            color: "#667eea",
            fontSize: "0.875rem",
          }}
        >
          Quên mật khẩu?
        </Link>
      </Box>

      {/* Login Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 1,
          mb: 1,
          py: 1,
          fontSize: "0.9rem",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Đăng Nhập"}
      </Button>

      {/* Register Link */}
      <Typography
        variant="caption"
        align="center"
        color="text.secondary"
        sx={{ display: "block", fontSize: "0.75rem" }}
      >
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          style={{ textDecoration: "none", color: "#667eea", fontWeight: 600 }}
        >
          Đăng ký ngay
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
