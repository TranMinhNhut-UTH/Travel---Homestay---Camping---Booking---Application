# 🧪 Hướng dẫn Kiểm thử Module A (ED-21) - EV Dealer Management

Tài liệu này cung cấp hướng dẫn chi tiết về cách thiết lập, chạy bộ kiểm thử (Test Suite) cho **Module A** (ED-21) và quy trình tích hợp CI/CD tự động với Jira theo luồng "Enterprise" của nhóm.

## 📑 Mục lục
1. [Tổng quan Module A](#-tổng-quan-module-a)
2. [Yêu cầu hệ thống (Prerequisites)](#-yêu-cầu-hệ-thống-prerequisites)
3. [Cài đặt và Khởi chạy Backend](#-cài-đặt-và-khởi-chạy-backend)
4. [Hướng dẫn chạy Test Scripts](#-hướng-dẫn-chạy-test-scripts)
5. [Quy trình làm việc CI/CD & Jira (Luồng Enterprise)](#-quy-trình-làm-việc-cicd--jira-luồng-enterprise)
6. [Khắc phục sự cố (Troubleshooting)](#-khắc-phục-sự-cố-troubleshooting)

---

## 📋 Tổng quan Module A
Module A tập trung vào các chức năng cốt lõi của hệ thống quản lý đại lý xe điện (EV Dealer), bao gồm:
- **Authentication APIs**: Đăng nhập, Đăng ký, Quên mật khẩu.
- **User Management**: Quản lý người dùng, phân quyền.
- **Customer APIs**: Quản lý thông tin khách hàng.
- **Test Drive APIs**: Quản lý lịch hẹn lái thử.
- **Complaint APIs**: Quản lý khiếu nại và bảo hành.

---

## ⚙️ Yêu cầu hệ thống (Prerequisites)
Trước khi chạy các script kiểm thử, đảm bảo máy tính của bạn đã cài đặt:
- **Node.js** (Khuyến nghị phiên bản 18.x trở lên)
- **Newman** (Công cụ chạy Postman Collection qua CLI):
  ```bash
  npm install -g newman