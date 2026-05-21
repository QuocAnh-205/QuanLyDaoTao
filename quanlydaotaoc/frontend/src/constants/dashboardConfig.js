import {
    Bell, Calendar, FileText, MessageSquare,
    BookOpen, RefreshCw, Lock, Users,
    Settings, Activity, ClipboardList, TrendingUp, Shield
} from 'lucide-react';

// Cấu hình các widget (chức năng nhanh) cho Dashboard theo Role
// Dễ dàng mở rộng bằng cách thêm cấu hình mới vào object này
export const DASHBOARD_WIDGETS = {
    SINHVIEN: [
        {
            title: 'Thông báo & Sự kiện',
            items: [
                { id: 'sv-1', name: 'Thông báo chung', icon: Bell, path: '/settings', color: 'bg-blue-50 text-blue-600' },
                { id: 'sv-2', name: 'Thời khóa biểu', icon: Calendar, path: '/schedule', color: 'bg-indigo-50 text-indigo-600' },
                { id: 'sv-3', name: 'Lịch thi', icon: FileText, path: '/exams', color: 'bg-red-50 text-red-600' },
            ]
        },
        {
            title: 'Học tập & Lớp học',
            items: [
                { id: 'sv-4', name: 'Kết quả học tập', icon: TrendingUp, path: '/grades', color: 'bg-green-50 text-green-600' },
                { id: 'sv-5', name: 'Chương trình đào tạo', icon: BookOpen, path: '/academic', color: 'bg-amber-50 text-amber-600' },
                { id: 'sv-6', name: 'Diễn đàn lớp', icon: MessageSquare, path: '/student-classes', color: 'bg-purple-50 text-purple-600' },
            ]
        },
        {
            title: 'Dịch vụ sinh viên',
            items: [
                { id: 'sv-7', name: 'Đăng ký học phần', icon: RefreshCw, path: '/registration', color: 'bg-teal-50 text-teal-600' },
                { id: 'sv-8', name: 'Học phí', icon: FileText, path: '/finance', color: 'bg-rose-50 text-rose-600' },
                { id: 'sv-9', name: 'Đổi mật khẩu', icon: Lock, path: '/profile', color: 'bg-gray-100 text-gray-600' },
            ]
        }
    ],
    GIANGVIEN: [
        {
            title: 'Công tác giảng dạy',
            items: [
                { id: 'gv-1', name: 'Lịch giảng dạy', icon: Calendar, path: '/schedule', color: 'bg-blue-50 text-blue-600' },
                { id: 'gv-2', name: 'Nhập điểm', icon: ClipboardList, path: '/grades', color: 'bg-indigo-50 text-indigo-600' },
                { id: 'gv-3', name: 'Danh sách lớp', icon: Users, path: '/student-classes', color: 'bg-teal-50 text-teal-600' },
            ]
        },
        {
            title: 'Hệ thống',
            items: [
                { id: 'gv-4', name: 'Thông báo', icon: Bell, path: '/settings', color: 'bg-orange-50 text-orange-600' },
                { id: 'gv-5', name: 'Đổi mật khẩu', icon: Lock, path: '/profile', color: 'bg-gray-100 text-gray-600' },
            ]
        }
    ],
    GIAOVU: [
        {
            title: 'Quản lý đào tạo',
            items: [
                { id: 'gv-1', name: 'Sinh viên', icon: Users, path: '/students', color: 'bg-blue-50 text-blue-600' },
                { id: 'gv-2', name: 'Lớp hành chính', icon: BookOpen, path: '/student-classes', color: 'bg-indigo-50 text-indigo-600' },
                { id: 'gv-3', name: 'Giảng viên', icon: Users, path: '/lecturers', color: 'bg-teal-50 text-teal-600' },
            ]
        },
        {
            title: 'Hệ thống',
            items: [
                { id: 'gv-4', name: 'Cấu hình', icon: Settings, path: '/settings', color: 'bg-gray-100 text-gray-700' },
                { id: 'gv-5', name: 'Thống kê', icon: Activity, path: '/dashboard', color: 'bg-green-50 text-green-600' },
            ]
        }
    ],
    ADMIN: [
        {
            title: 'Quản trị hệ thống',
            items: [
                { id: 'ad-1', name: 'Người dùng', icon: Users, path: '/users', color: 'bg-purple-50 text-purple-600' },
                { id: 'ad-2', name: 'Phân quyền', icon: Shield, path: '/users', color: 'bg-red-50 text-red-600' },
                { id: 'ad-3', name: 'Cấu hình hệ thống', icon: Settings, path: '/settings', color: 'bg-gray-100 text-gray-700' },
            ]
        }
    ]
};
