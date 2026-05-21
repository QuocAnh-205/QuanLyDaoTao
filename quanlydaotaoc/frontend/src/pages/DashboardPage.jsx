import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { DASHBOARD_WIDGETS } from '../constants/dashboardConfig';
import { ChevronRight, Shield } from 'lucide-react';

const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    // Lấy role đầu tiên (hoặc ưu tiên role cao nhất nếu có nhiều role)
    const primaryRole = user?.roles?.[0] || 'SINHVIEN';
    const widgets = DASHBOARD_WIDGETS[primaryRole] || [];

    // Trả về lời chào phù hợp
    const renderGreeting = () => {
        if (!user) return null;

        const greetings = {
            ADMIN: { title: 'Trang quản trị hệ thống', color: 'bg-purple-100 border-purple-500 text-purple-800', roleName: 'Quản trị viên' },
            GIAOVU: { title: 'Trang quản lý đào tạo', color: 'bg-green-100 border-green-500 text-green-800', roleName: 'Giáo vụ' },
            GIANGVIEN: { title: 'Trang quản lý giảng dạy', color: 'bg-blue-100 border-blue-500 text-blue-800', roleName: 'Giảng viên' },
            SINHVIEN: { title: 'Trang thông tin sinh viên', color: 'bg-orange-100 border-orange-500 text-orange-800', roleName: 'Sinh viên' },
        };

        const config = greetings[primaryRole] || greetings.SINHVIEN;

        return (
            <div className={`border-l-4 p-5 mb-8 rounded-r-xl shadow-sm ${config.color} animate-fadeIn`}>
                <h2 className="font-bold text-lg mb-1">{config.title}</h2>
                <p className="opacity-90">Xin chào {config.roleName} <strong>{user.fullName}</strong>. Chúc bạn một ngày làm việc hiệu quả!</p>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
            {renderGreeting()}

            <div className="space-y-8">
                {widgets.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
                            {section.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(item.path)}
                                        className="group relative bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 text-left flex items-start gap-4 overflow-hidden"
                                    >
                                        <div className={`p-3 rounded-xl shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 mt-1">
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">Nhấn để truy cập chức năng</p>
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <ChevronRight className="text-blue-400" size={20} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;