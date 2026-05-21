/**
 * Mock Notification Data for Development
 * TODO: Replace with real API calls when backend is ready
 */

export const mockNotifications = [
  {
    id: 1,
    type: "orders",
    title: "Đơn hàng mới nhận được",
    message: "Đơn hàng #1234 từ Nguyễn Văn A",
    isRead: false,
    createdAt: "2024-01-20T14:30:00Z",
    metadata: {
      orderId: "1234",
      customerName: "Nguyễn Văn A",
      amount: 45000
    }
  },
  {
    id: 2,
    type: "payments",
    title: "Thanh toán đã nhận",
    message: "$15,000 thanh toán cho Đơn hàng #1233",
    isRead: false,
    createdAt: "2024-01-20T12:15:00Z",
    metadata: {
      orderId: "1233",
      amount: 15000,
      paymentMethod: "Credit Card"
    }
  },
  {
    id: 3,
    type: "deliveries",
    title: "Cập nhật giao hàng",
    message: "Đơn hàng #1229 đã được giao thành công",
    isRead: true,
    createdAt: "2024-01-20T10:45:00Z",
    metadata: {
      orderId: "1229",
      status: "delivered",
      deliveryDate: "2024-01-20T09:30:00Z"
    }
  },
  {
    id: 4,
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống sẽ bảo trì vào lúc 2:00 AM - 4:00 AM",
    isRead: true,
    createdAt: "2024-01-19T16:20:00Z",
    metadata: {
      maintenanceStart: "2024-01-21T02:00:00Z",
      maintenanceEnd: "2024-01-21T04:00:00Z"
    }
  },
  {
    id: 5,
    type: "orders",
    title: "Đơn hàng mới nhận được",
    message: "Đơn hàng #1235 từ Trần Thị B",
    isRead: false,
    createdAt: "2024-01-19T11:30:00Z",
    metadata: {
      orderId: "1235",
      customerName: "Trần Thị B",
      amount: 52000
    }
  },
  {
    id: 6,
    type: "deliveries",
    title: "Thông báo giao hàng",
    message: "Đơn hàng #1230 sẽ được giao trong 2 giờ tới",
    isRead: false,
    createdAt: "2024-01-19T09:15:00Z",
    metadata: {
      orderId: "1230",
      estimatedDelivery: "2024-01-19T11:15:00Z",
      driverName: "Nguyễn Văn C"
    }
  },
  {
    id: 7,
    type: "payments",
    title: "Thanh toán thất bại",
    message: "Thanh toán cho Đơn hàng #1228 đã bị từ chối",
    isRead: true,
    createdAt: "2024-01-18T15:45:00Z",
    metadata: {
      orderId: "1228",
      amount: 38000,
      reason: "Insufficient funds"
    }
  },
  {
    id: 8,
    type: "system",
    title: "Thông báo bảo mật",
    message: "Đăng nhập mới từ thiết bị không xác định",
    isRead: false,
    createdAt: "2024-01-18T13:20:00Z",
    metadata: {
      ipAddress: "192.168.1.100",
      location: "Ho Chi Minh City, Vietnam",
      device: "Chrome on Windows"
    }
  },
  {
    id: 9,
    type: "orders",
    title: "Đơn hàng hủy",
    message: "Đơn hàng #1225 đã được hủy bởi khách hàng",
    isRead: true,
    createdAt: "2024-01-17T10:30:00Z",
    metadata: {
      orderId: "1225",
      customerName: "Lê Văn D",
      reason: "Customer request"
    }
  },
  {
    id: 10,
    type: "deliveries",
    title: "Vấn đề giao hàng",
    message: "Không thể giao Đơn hàng #1220 - địa chỉ không chính xác",
    isRead: true,
    createdAt: "2024-01-16T14:10:00Z",
    metadata: {
      orderId: "1220",
      issue: "Invalid address",
      attempts: 3
    }
  }
]

export const notificationTypes = [
  { value: "all", label: "Tất cả", icon: "🔔" },
  { value: "orders", label: "Đơn hàng", icon: "📦" },
  { value: "deliveries", label: "Giao hàng", icon: "🚚" },
  { value: "payments", label: "Thanh toán", icon: "💰" },
  { value: "system", label: "Hệ thống", icon: "⚙️" }
]

export const mockNotificationStats = {
  total: 10,
  unread: 5,
  byType: {
    orders: 3,
    deliveries: 2,
    payments: 2,
    system: 3
  }
}
