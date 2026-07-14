import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import MainLayout from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/students/StudentListPage';
import ClassHierarchyPage from './pages/students/ClassHierarchyPage';
import LecturerManagementPage from './pages/lecturers/LecturerManagementPage';

import ProfilePage from './pages/ProfilePage';
import ERDiagramView from './pages/ERDiagramView';
import SystemConfigPage from './pages/SystemConfigPage';

// Modules IV & V
import CourseManagementPage from './pages/academic-management/CourseManagementPage';
import AcademicManagementPage from './pages/academic-management/AcademicManagementPage';
import TuitionManagementPage from './pages/finance/TuitionManagementPage';
import GradeManagementPage from './pages/academic-management/GradeManagementPage';


// Placeholder Components cho các Module chưa triển khai
const Placeholder = ({ title }) => (
  <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-500 italic">Tính năng này đang được phát triển theo lộ trình của Giai đoạn tiếp theo...</p>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
      <Routes>
        {/* NHÓM 1: PUBLIC ROUTES - Dành cho khách / chưa đăng nhập */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* NHÓM 2: PROTECTED ROUTES - Yêu cầu Token & MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Mặc định vào Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Thêm vào trong nhóm <Route element={<MainLayout />}> */}
            <Route path="/er-diagram" element={<ERDiagramView />} />

            {/* Đăng ký các Route tương ứng với menuConfig.js */}
            <Route path="/users" element={<Placeholder title="Quản trị Người dùng & Phân quyền" />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/student-classes" element={<ClassHierarchyPage />} />
            <Route path="/lecturers" element={<LecturerManagementPage />} />

            <Route path="/academic" element={<CourseManagementPage />} />
            <Route path="/academic-management" element={<AcademicManagementPage />} />

            <Route path="/registration" element={<Placeholder title="Đăng ký học phần trực tuyến" />} />
            <Route path="/schedule" element={<Placeholder title="Thời khóa biểu & Lịch giảng dạy" />} />
            <Route path="/grades" element={<GradeManagementPage />} />
            <Route path="/tuition" element={<TuitionManagementPage />} />
            <Route path="/finance" element={<Placeholder title="Học phí & Giao dịch tài chính" />} />
            <Route path="/exams" element={<Placeholder title="Khảo thí & Xét tốt nghiệp" />} />
            <Route path="/settings" element={<Placeholder title="Thông báo & Cấu hình hệ thống" />} />
            <Route path="/system-config" element={<SystemConfigPage />} />
          </Route>
        </Route>

        {/* CẤU HÌNH FALLBACK: Mọi đường dẫn lạ đều đẩy về /login hoặc /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;