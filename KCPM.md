# 📘 Project Requirement Summary - Software Verification Course

## 1. Tổng quan hệ thống

Hệ thống mô phỏng quy trình phát triển phần mềm theo mô hình:

- Frontend - Backend độc lập
- Backend cung cấp REST API
- Giao tiếp qua HTTP protocol
- Có tích hợp:
  - Jira (quản lý task / bug / workflow)
  - GitHub/GitLab (quản lý source code)
  - Postman (test API)
  - CI/CD (optional theo repo)

---

## 2. Kiến trúc hệ thống

### 2.1 Frontend - Backend separation
- Frontend chỉ gọi API
- Backend xử lý logic nghiệp vụ
- Không phụ thuộc trực tiếp nhau

### 2.2 Backend
- Xây dựng theo REST API
- Sử dụng HTTP protocol
- Có unit test coverage
- Log lỗi rõ ràng để tracking qua Jira

---

## 3. Công nghệ sử dụng

### Backend
- REST API
- Java / Node.js / Spring Boot (tuỳ project)
- Unit Testing framework (JUnit / Jest / Mocha)

### Tool hỗ trợ
- Jira (task management)
- GitHub (version control)
- Postman (API testing)
- Web IDE / VSCode
- Command Line (git, run test)

---

## 4. Quy trình làm việc (Workflow)

### 4.1 Flow chính

### 4.2 Chi tiết quy trình

1. Member 1:
   - Nhận Functional Requirements
   - Viết Unit Test
   - Chạy test
   - Nếu fail → tạo bug trên Jira

2. Jira Flow:
   - Bug được log lên Jira
   - Assign cho Member 2

3. Member 2:
   - Fix bug
   - Commit lại source code

4. Review:
   - Merge vào main branch

---

## 5. Git Workflow

- Có thể dùng nhiều branch
- Quy định chính:
  - `main` branch là bản chính cuối tuần
  - Feature branches cho từng task
  - Merge theo tuần

### Chu trình lặp:

---

## 6. Jira Requirements

### 6.1 Task tracking
- Mỗi lỗi phải tạo Jira Issue
- Issue phải có:
  - ID
  - Comment chuẩn (bắt buộc)
  - Log lỗi rõ ràng

### 6.2 Quy tắc chấm điểm
- Sai comment hoặc thiếu ID → bị rớt
- Jira là nguồn đối chiếu chính với Git history

---

## 7. Postman & API Testing

### 7.1 Postman usage
- Tạo Workspace theo project
- Tạo Collection theo module
- Sử dụng Environment variables:
  - base_url
  - token
  - api_key

### 7.2 Test Script
- Có pre-request script
- Có test script để validate response
- Automation test cơ bản

---

## 8. Environment & Security

- File `.env` chứa:
  - Jira token
  - API keys
- ⚠️ KHÔNG commit file `.env` lên repo
- Sử dụng `.gitignore` để loại trừ

---

## 9. Reporting (Báo cáo)

### 9.1 Tần suất
- Mỗi tuần 1 report
- Tổng cộng: 8 tuần → 8 reports

### 9.2 Nội dung report
- Jira tickets đã xử lý
- Git commits
- Test results
- Bug logs
- Sprint summary

### 9.3 Format
- Markdown (`.md`)
- Convert sang PDF để nộp

---

## 10. Project Structure yêu cầu

- Repo phải có:
  - `main` branch
  - feature branches
  - test folder
  - logs/report folder
  - `.env.example`
  - `.gitignore`

---

## 11. Tổng hợp cuối kỳ (Final Skill File)

- Sau khi hoàn thành project:
  - Tổng hợp toàn bộ kiến thức + workflow
  - Tạo 1 file skills duy nhất
  - Mục tiêu: giúp team sau không phải tốn thời gian setup lại Jira / repo / workflow

---

## 12. Lưu ý quan trọng

- Commit history sẽ bị kiểm tra
- Jira + Git phải khớp nhau 100%
- Main branch là căn cứ chấm điểm cuối tuần
- Comment Jira bắt buộc chuẩn hóa
- Có thể dùng nhiều branch nhưng phải rõ ràng

---