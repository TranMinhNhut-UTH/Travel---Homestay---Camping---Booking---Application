import React from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Container, 
  Grid, 
  Typography,
  Divider
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  People as PeopleIcon,
  ShoppingCart as SalesIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ContractIcon,
} from "@mui/icons-material";
import { PageHeader } from "../../components/common";

const highlightItems = [
  {
    icon: <CarIcon fontSize="large" />,
    title: "Quản Lý Xe Điện",
    description: "Quản lý danh mục xe, cấu hình, màu sắc và tồn kho",
  },
  {
    icon: <SalesIcon fontSize="large" />,
    title: "Quản Lý Bán Hàng",
    description: "Báo giá, đơn hàng, hợp đồng và thanh toán",
  },
  {
    icon: <PeopleIcon fontSize="large" />,
    title: "Quản Lý Khách Hàng",
    description: "CRM, lịch lái thử và chăm sóc khách hàng",
  },
  {
    icon: <TrendingUpIcon fontSize="large" />,
    title: "Báo Cáo & Thống Kê",
    description: "Phân tích doanh số và dự báo nhu cầu",
  },
  {
    icon: <ContractIcon fontSize="large" />,
    title: "Quản Lý Hợp Đồng",
    description: "Tạo, theo dõi và quản lý hợp đồng",
  },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h1" 
          fontWeight={800} 
          gutterBottom
          sx={{ 
            fontSize: { xs: '3rem', md: '4rem' },
            background: 'linear-gradient(135deg, #1976d2 0%, #004ba0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          Quản Lý Đại Lý Xe Điện
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 4, 
            maxWidth: 600, 
            mx: 'auto', 
            lineHeight: 1.6,
            fontSize: { xs: '1.2rem', md: '1.4rem' }
          }}
        >
          Giải pháp toàn diện cho việc quản lý xe điện, bán hàng, khách hàng và báo cáo thống kê
        </Typography>
      </Box>

      {/* Features Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          fontWeight={600} 
          gutterBottom
          sx={{ mb: 2 }}
        >
          Tính Năng Nổi Bật
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Quản lý toàn diện mọi khía cạnh của đại lý xe điện
        </Typography>
        
        <Divider sx={{ mb: 6 }} />
        
        <Grid container spacing={4} justifyContent="center">
          {highlightItems.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.title} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  borderRadius: 2,
                  boxShadow: 1,
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    fontWeight={600}
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    {item.title}
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ lineHeight: 1.6 }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;

