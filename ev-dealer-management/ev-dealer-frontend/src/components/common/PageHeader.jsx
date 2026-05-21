import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from "@mui/icons-material";

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  stats = [],
  showRefresh = false,
  onRefresh,
  viewMode = "list", // 'list' or 'grid'
  onViewModeChange,
  className = "",
}) => {
  return (
    <Box className={`page-header fade-in ${className}`} sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              underline="hover"
              color={
                index === breadcrumbs.length - 1 ? "text.primary" : "inherit"
              }
              href={crumb.href}
              sx={{
                fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                color:
                  index === breadcrumbs.length - 1
                    ? "text.primary"
                    : "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {index === 0 && <HomeIcon fontSize="small" />}
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Title Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: subtitle ? 1 : 0,
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <Box
              sx={{
                display: "flex",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Tooltip title="Xem dạng danh sách">
                <IconButton
                  size="small"
                  onClick={() => onViewModeChange("list")}
                  sx={{
                    bgcolor:
                      viewMode === "list" ? "primary.main" : "transparent",
                    color: viewMode === "list" ? "white" : "text.secondary",
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor:
                        viewMode === "list" ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <ViewListIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xem dạng lưới">
                <IconButton
                  size="small"
                  onClick={() => onViewModeChange("grid")}
                  sx={{
                    bgcolor:
                      viewMode === "grid" ? "primary.main" : "transparent",
                    color: viewMode === "grid" ? "white" : "text.secondary",
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor:
                        viewMode === "grid" ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <GridViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Refresh Button */}
          {showRefresh && (
            <Tooltip title="Làm mới">
              <IconButton onClick={onRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Filter Button */}
          <Tooltip title="Bộ lọc">
            <IconButton color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>

          {/* Export Button */}
          <Tooltip title="Xuất dữ liệu">
            <IconButton color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          {/* Custom Actions */}
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "contained"}
              color={action.color || "primary"}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                ...action.sx,
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Stats Section */}
      {stats.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction="row"
            spacing={3}
            sx={{
              mb: 3,
              justifyContent: "center",
              width: "100%",
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                  maxWidth: 200,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: stat.color || "primary.main",
                    width: 64,
                    height: 64,
                    fontSize: "1.5rem",
                    mb: 1.5,
                    "& .MuiSvgIcon-root": {
                      fontSize: "2rem",
                    },
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      mb: 0.5,
                      fontSize: "1.8rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      fontSize: "1rem",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PageHeader;
