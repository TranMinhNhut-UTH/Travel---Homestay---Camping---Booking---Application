// mockDataSales.js

// ... (giữ nguyên các import khác nếu có)

// Mock vehicles với ảnh local
export const mockVehicles = [
  { id: 'vf8', name: 'VinFast VF8', price: 1200000000, image: '/src/assets/img/car1.png' },
  { id: 'vf9', name: 'VinFast VF9', price: 1500000000, image: '/src/assets/img/car2.png' },
  { id: 'vf5', name: 'VinFast VF5', price: 500000000, image: '/src/assets/img/car3.png' },
  { id: 'vf6', name: 'VinFast VF6', price: 750000000, image: '/src/assets/img/car4.png' },
  { id: 'vfe34', name: 'VinFast VF e34', price: 650000000, image: '/src/assets/img/car1.png' } // Lặp lại car1 nếu chỉ có 4 file
];

// Mock orders với ảnh local
export const mockOrders = [
  {
    id: 'ORD-2025-001',
    customer: 'Nguyễn Văn A',
    vehicle: 'VinFast VF8',
    quantity: 1,
    totalAmount: 1200000000,
    status: 'completed',
    paymentType: 'full',
    orderDate: '2025-10-15',
    customerPhone: '0912345678',
    customerEmail: 'nguyenvana@email.com',
    vehicleImage: '/src/assets/img/car1.png', // Thay đổi từ placeholder
    downPayment: 300000000,
    remainingAmount: 900000000,
  },
  {
    id: 'ORD-2025-002',
    customer: 'Trần Thị B',
    vehicle: 'VinFast VF9',
    quantity: 2,
    totalAmount: 3000000000,
    status: 'confirmed',
    paymentType: 'installment',
    orderDate: '2025-10-18',
    customerPhone: '0923456789',
    customerEmail: 'tranthib@email.com',
    vehicleImage: '/src/assets/img/car2.png', // Thay đổi
    downPayment: 900000000,
    remainingAmount: 2100000000,
  },
  {
    id: 'ORD-2025-003',
    customer: 'Lê Văn C',
    vehicle: 'VinFast VF5',
    quantity: 1,
    totalAmount: 500000000,
    status: 'pending',
    paymentType: 'full',
    orderDate: '2025-10-20',
    customerPhone: '0934567890',
    customerEmail: 'levanc@email.com',
    vehicleImage: '/src/assets/img/car3.png', // Thay đổi
    downPayment: 500000000,
    remainingAmount: 0,
  },
  {
    id: 'ORD-2025-004',
    customer: 'Phạm Thị D',
    vehicle: 'VinFast VF6',
    quantity: 1,
    totalAmount: 750000000,
    status: 'cancelled',
    paymentType: 'installment',
    orderDate: '2025-10-19',
    customerPhone: '0945678901',
    customerEmail: 'phamthid@email.com',
    vehicleImage: '/src/assets/img/car4.png', // Thay đổi
    downPayment: 225000000,
    remainingAmount: 525000000,
  },
  {
    id: 'ORD-2025-005',
    customer: 'Hoàng Văn E',
    vehicle: 'VinFast VF e34',
    quantity: 1,
    totalAmount: 650000000,
    status: 'confirmed',
    paymentType: 'installment',
    orderDate: '2025-10-21',
    customerPhone: '0956789012',
    customerEmail: 'hoangvane@email.com',
    vehicleImage: '/src/assets/img/car1.png', // Thay đổi
    downPayment: 195000000,
    remainingAmount: 455000000,
  },
  {
    id: 'ORD-2025-006',
    customer: 'Vũ Thị F',
    vehicle: 'VinFast VF8 Plus',
    quantity: 1,
    totalAmount: 1350000000,
    status: 'pending',
    paymentType: 'full',
    orderDate: '2025-10-22',
    customerPhone: '0967890123',
    customerEmail: 'vuthif@email.com',
    vehicleImage: '/src/assets/img/car1.png', // Thay đổi (VF8+ dùng car1)
    downPayment: 1350000000,
    remainingAmount: 0,
  },
];

export const mockOrder = {
  id: 'ORD-2025-001',
  customer: {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    email: 'nguyenvana@email.com',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    idNumber: '123456789',
    idIssueDate: '2020-01-15',
    idIssuePlace: 'TP.HCM'
  },
  vehicle: {
    name: 'VinFast VF8 Plus',
    model: 'VF8',
    color: 'Đen',
    vin: 'VF8VN2025001234',
    price: 1350000000,
    image: '/src/assets/img/car1.png' // Thay đổi từ placeholder
  },
  orderInfo: {
    orderDate: '2025-10-15',
    expectedDeliveryDate: '2025-11-30',
    salesPerson: 'John Doe',
    branch: 'VinFast Quận 1',
    status: 'confirmed',
    quantity: 1,
    unitPrice: 1350000000,
    discount: 50000000,
    totalPrice: 1300000000
  },
  payment: {
    type: 'installment',
    downPayment: 390000000,
    downPaymentPaid: 390000000,
    loanAmount: 910000000,
    loanTerm: 24,
    interestRate: 8.5,
    monthlyPayment: 41350000
  }
};

export const mockPaymentSchedule = [
  { month: 1, dueDate: '2025-12-15', amount: 41350000, status: 'paid', paidDate: '2025-12-10' },
  { month: 2, dueDate: '2026-01-15', amount: 41350000, status: 'paid', paidDate: '2026-01-12' },
  { month: 3, dueDate: '2026-02-15', amount: 41350000, status: 'pending', paidDate: null },
  { month: 4, dueDate: '2026-03-15', amount: 41350000, status: 'pending', paidDate: null },
  { month: 5, dueDate: '2026-04-15', amount: 41350000, status: 'pending', paidDate: null },
  { month: 6, dueDate: '2026-05-15', amount: 41350000, status: 'pending', paidDate: null }
];

export const mockContracts = [
  { id: 1, name: 'Hợp đồng mua bán xe.pdf', uploadDate: '2025-10-16', size: '2.3 MB' },
  { id: 2, name: 'Hợp đồng tài chính.pdf', uploadDate: '2025-10-16', size: '1.8 MB' }
];