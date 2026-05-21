# Hướng dẫn Tích hợp Frontend - Hiển thị Dữ liệu từ ReportingService

File này hướng dẫn cách tạo trang frontend (React) để **lấy dữ liệu từ ReportingService API** và **hiển thị dưới dạng bảng + biểu đồ**.

---

## 1. Chuẩn bị

### Yêu cầu

- ReportingService đang chạy (http://localhost:5208)
- Dữ liệu đã được import via Postman (xem `IMPORT_DATA_GUIDE.md`)
- React dev environment sẵn sàng (folder `ev-dealer-frontend`)

### Kiểm tra CORS

ReportingService đã cấu hình CORS cho `http://localhost:5173` (hoặc `localhost:3000`), nên frontend có thể gọi API.

---

## 2. Sử dụng service có sẵn (`reportService.js`)

Repo frontend đã có sẵn client Axios tại `ev-dealer-frontend/src/services/reportService.js`.  
Service này tự động lấy `VITE_REPORTING_SERVICE_URL` (nên thêm biến môi trường này khi triển khai).

```javascript
// src/services/reportService.js (rút gọn)
import axios from "axios";

const reportingApi = axios.create({
  baseURL:
    import.meta.env.VITE_REPORTING_SERVICE_URL ||
    "http://localhost:5208/api/reports",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

reportingApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { data } = error.response;
      return Promise.reject(data.message || data.error || "Reporting API error");
    }
    return Promise.reject("Network error. Please check your connection.");
  }
);

export const reportService = {
  getSummary: (params = {}) => { /* ... */ },
  getSalesByRegion: (params = {}) => { /* ... */ },
  getSalesProportion: (params = {}) => { /* ... */ },
  getTopVehicles: (params = {}) => { /* ... */ },
  exportReport: (payload = {}) =>
    reportingApi.post("/export", payload, { responseType: "blob" }),
  // + các hàm REST đầy đủ trong file thực tế
};
```

> 💡 Tip: Nếu bạn muốn thêm hàm mới (ví dụ `getSalesSummary`), hãy mở file trên và mở rộng object `reportService` cho thống nhất với codebase.

---

## 3. Tạo Component: Bảng Sales Summary

Tạo file: `ev-dealer-frontend/src/components/SalesSummaryTable.jsx`

```jsx
// SalesSummaryTable.jsx
import React, { useState, useEffect } from "react";
import { reportService } from "../services/reportService";
import "./SalesSummaryTable.css";

export function SalesSummaryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    dealerId: "",
  });

  // Lấy dữ liệu khi component mount hoặc filter thay đổi
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getSalesSummary(filters);
      setData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRefresh = () => {
    loadData();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="sales-summary-container">
      <h2>📊 Tổng hợp Doanh số</h2>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="fromDate">Từ ngày:</label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="toDate">Đến ngày:</label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dealerId">ID Nhà bán:</label>
          <input
            type="text"
            id="dealerId"
            name="dealerId"
            placeholder="(UUID)"
            value={filters.dealerId}
            onChange={handleFilterChange}
            style={{ width: "200px" }}
          />
        </div>

        <button onClick={handleRefresh} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      {/* Status */}
      {loading && <p className="status-loading">⏳ Đang tải...</p>}
      {error && <p className="status-error">❌ Lỗi: {error}</p>}

      {/* Table */}
      {!loading && !error && (
        <div className="table-wrapper">
          <table className="sales-summary-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Nhà bán hàng</th>
                <th>Nhân viên bán</th>
                <th>Số đơn hàng</th>
                <th>Doanh thu</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.dealerName}</td>
                    <td>{item.salespersonName}</td>
                    <td className="text-center">{item.totalOrders}</td>
                    <td className="text-right">
                      {formatCurrency(item.totalRevenue)}
                    </td>
                    <td>{formatDate(item.lastUpdatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="table-footer">
            Tổng: <strong>{data ? data.length : 0}</strong> record
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Tạo CSS cho Sales Summary Table

Tạo file: `ev-dealer-frontend/src/components/SalesSummaryTable.css`

```css
.sales-summary-container {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.sales-summary-container h2 {
  color: #333;
  margin-bottom: 20px;
}

/* Filter Section */
.filter-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.9em;
  font-weight: 500;
  color: #555;
}

.filter-group input {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9em;
}

.filter-group input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.btn-refresh {
  padding: 10px 15px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.3s;
}

.btn-refresh:hover {
  background: #2e5c8a;
}

/* Status Messages */
.status-loading {
  text-align: center;
  color: #ff9800;
  font-size: 1.1em;
  padding: 20px;
}

.status-error {
  text-align: center;
  color: #f44336;
  font-size: 1em;
  padding: 15px;
  background: #ffebee;
  border-radius: 4px;
}

/* Table */
.table-wrapper {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.sales-summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.sales-summary-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.sales-summary-table th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.sales-summary-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.sales-summary-table tbody tr:hover {
  background: #f9f9f9;
}

.sales-summary-table td {
  padding: 12px 15px;
  color: #555;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
  font-weight: 500;
  color: #2e7d32;
}

.table-footer {
  padding: 12px 15px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  text-align: right;
  color: #666;
  font-size: 0.9em;
}
```

---

## 5. Tạo Component: Bảng Inventory Summary

Tạo file: `ev-dealer-frontend/src/components/InventorySummaryTable.jsx`

```jsx
// InventorySummaryTable.jsx
import React, { useState, useEffect } from "react";
import { reportService } from "../services/reportService";
import "./InventorySummaryTable.css";

export function InventorySummaryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportService.getInventorySummary();
      setData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="inventory-summary-container">
      <h2>📦 Tồn kho Xe</h2>

      {loading && <p className="status-loading">⏳ Đang tải...</p>}
      {error && <p className="status-error">❌ Lỗi: {error}</p>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="inventory-summary-table">
            <thead>
              <tr>
                <th>Tên xe</th>
                <th>Nhà bán hàng</th>
                <th>Số lượng tồn</th>
                <th>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="vehicle-name">{item.vehicleName}</td>
                    <td>{item.dealerName}</td>
                    <td className="stock-count">
                      <span
                        className={`badge ${
                          item.stockCount > 5 ? "in-stock" : "low-stock"
                        }`}
                      >
                        {item.stockCount}
                      </span>
                    </td>
                    <td>{formatDate(item.lastUpdatedAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="table-footer">
            Tổng: <strong>{data ? data.length : 0}</strong> mẫu xe
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Tạo CSS cho Inventory Summary Table

Tạo file: `ev-dealer-frontend/src/components/InventorySummaryTable.css`

```css
.inventory-summary-container {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.inventory-summary-container h2 {
  color: #333;
  margin-bottom: 20px;
}

.status-loading {
  text-align: center;
  color: #ff9800;
  font-size: 1.1em;
  padding: 20px;
}

.status-error {
  text-align: center;
  color: #f44336;
  font-size: 1em;
  padding: 15px;
  background: #ffebee;
  border-radius: 4px;
}

.table-wrapper {
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.inventory-summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95em;
}

.inventory-summary-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.inventory-summary-table th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.inventory-summary-table tbody tr {
  border-bottom: 1px solid #eee;
}

.inventory-summary-table tbody tr:hover {
  background: #f9f9f9;
}

.inventory-summary-table td {
  padding: 12px 15px;
  color: #555;
}

.vehicle-name {
  font-weight: 500;
  color: #1976d2;
}

.stock-count {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85em;
}

.badge.in-stock {
  background: #c8e6c9;
  color: #2e7d32;
}

.badge.low-stock {
  background: #ffccbc;
  color: #d84315;
}

.text-center {
  text-align: center;
}

.table-footer {
  padding: 12px 15px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  text-align: right;
  color: #666;
  font-size: 0.9em;
}
```

---

## 7. Tích hợp vào Main App

Cập nhật file: `ev-dealer-frontend/src/App.jsx`

```jsx
// App.jsx - Thêm imports
import { SalesSummaryTable } from "./components/SalesSummaryTable";
import { InventorySummaryTable } from "./components/InventorySummaryTable";

function App() {
  return (
    <div className="App">
      <header>
        <h1>EV Dealer Management System</h1>
      </header>

      <main>
        {/* Thêm hai component mới */}
        <SalesSummaryTable />
        <InventorySummaryTable />
      </main>
    </div>
  );
}

export default App;
```

---

## 8. Chạy Frontend

```powershell
cd ev-dealer-frontend
npm run dev
```

Mở trình duyệt: http://localhost:5173

Nếu dùng port khác, kiểm tra `.env` hoặc console output.

---

## 9. Kiểm tra

1. ✅ Bảng Sales Summary hiển thị dữ liệu đã import
2. ✅ Bảng Inventory Summary hiển thị xe
3. ✅ Filter hoạt động (ngày, dealer)
4. ✅ Nút Làm mới làm mới dữ liệu
5. ✅ CSS đẹp, responsive

---

## 10. Troubleshooting

| Vấn đề               | Nguyên nhân                      | Cách khắc phục                                                       |
| -------------------- | -------------------------------- | -------------------------------------------------------------------- |
| CORS Error           | Frontend không được phép gọi API | Kiểm tra CORS config trong `Program.cs` (line ~27)                   |
| "Cannot find module" | Import path sai                  | Kiểm tra file path: `src/services/reportService.js`                  |
| Không có dữ liệu     | API không trả data               | Kiểm tra ReportingService đang chạy + import data qua Postman        |
| Kết nối bị từ chối   | API không chạy                   | `$env:USE_SQLITE = "true"; dotnet run` trong ReportingService folder |

---

## 11. Tiếp theo

- Thêm biểu đồ (Chart.js / Recharts)
- Thêm form thêm/sửa dữ liệu
- Export dữ liệu (CSV, PDF)
- Phân trang
- Search nâng cao

---

**Bây giờ bạn có thể import dữ liệu qua Postman và xem trực tiếp trên web!**
