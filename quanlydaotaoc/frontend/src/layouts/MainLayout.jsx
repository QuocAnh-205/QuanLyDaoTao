import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell, Settings, Search, Command, Sparkles, BookOpen, CreditCard } from 'lucide-react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import notificationApi from '../api/notificationApi';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // States for notifications
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await notificationApi.getNotifications();
            if (response.success && response.data) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error("Failed to load notifications:", error);
        }
    };

    const loadUnreadCount = async () => {
        try {
            const response = await notificationApi.getUnreadCount();
            if (response.success && response.data !== undefined) {
                setUnreadCount(response.data);
            }
        } catch (error) {
            console.error("Failed to load unread count:", error);
        }
    };

    useEffect(() => {
        if (user) {
            loadNotifications();
            loadUnreadCount();

            // Refresh periodically every 45 seconds
            const interval = setInterval(() => {
                loadNotifications();
                loadUnreadCount();
            }, 45000);

            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (id, isRead) => {
        if (isRead) return; // Already read
        try {
            const response = await notificationApi.markAsRead(id);
            if (response.success) {
                setNotifications(prev => prev.map(notif => 
                    notif.id === id ? { ...notif, isRead: true, readAt: new Date().toISOString() } : notif
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            const response = await notificationApi.markAllAsRead();
            if (response.success) {
                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return 'Vừa xong';
            if (diffMins < 60) return `${diffMins} phút trước`;
            if (diffHours < 24) return `${diffHours} giờ trước`;
            return `${diffDays} ngày trước`;
        } catch (e) {
            return '';
        }
    };

    const getNotifIcon = (title) => {
        const lower = (title || '').toLowerCase();
        if (lower.includes('học phí') || lower.includes('thanh toán') || lower.includes('tiền')) {
            return (
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
                    <CreditCard size={18} />
                </div>
            );
        }
        if (lower.includes('đăng ký') || lower.includes('học phần') || lower.includes('môn học')) {
            return (
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                    <BookOpen size={18} />
                </div>
            );
        }
        if (lower.includes('chào mừng') || lower.includes('tài khoản')) {
            return (
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
                    <Sparkles size={18} />
                </div>
            );
        }
        return (
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 shrink-0">
                <Bell size={18} />
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Cột trái: Sidebar điều hướng */}
            <Sidebar />

            {/* Cột phải: Header + Nội dung chính */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Visual Background Element */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>

                {/* Modern Header */}
                <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 h-20 flex items-center justify-between px-10 shrink-0 z-40 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-96 group focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/5 focus-within:border-emerald-500/50 transition-all">
                            <Search size={18} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm nhanh..." 
                                className="bg-transparent border-none outline-none text-sm font-bold text-slate-600 placeholder:text-slate-400 flex-1"
                            />
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-md shadow-sm">
                                <Command size={10} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.15em]">
                                    {user?.roles?.[0] === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : user?.roles?.[0] === 'GIAOVU' ? 'GIÁO VỤ' : user?.roles?.[0] === 'GIANGVIEN' ? 'GIẢNG VIÊN' : user?.roles?.[0] === 'SINHVIEN' ? 'SINH VIÊN' : 'KHÁCH'}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200/60 hidden sm:block"></div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => {
                                    setIsNotifOpen(!isNotifOpen);
                                    if (!isNotifOpen) {
                                        loadNotifications();
                                        loadUnreadCount();
                                    }
                                }}
                                className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all relative group shadow-sm bg-white border border-slate-100"
                            >
                                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-4 w-96 bg-white/95 backdrop-blur-xl rounded-[1.8rem] shadow-2xl border border-slate-200/60 py-4 animate-slideUp z-50 overflow-hidden">
                                    <div className="px-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-slate-900">Thông báo</p>
                                            {unreadCount > 0 && (
                                                <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md shadow-emerald-500/20">
                                                    {unreadCount} mới
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                                            >
                                                Đánh dấu tất cả đã đọc
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="py-12 px-6 text-center">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                                    <Bell size={20} className="text-slate-300" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400">Không có thông báo nào</p>
                                                <p className="text-[10px] text-slate-400/70 mt-1">Hệ thống sẽ gửi thông báo cho bạn khi có hoạt động mới.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-50">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                                                        className={`p-4 flex gap-3.5 transition-all duration-300 relative cursor-pointer group/item select-none
                                                            ${notif.isRead ? 'hover:bg-slate-50/50' : 'bg-emerald-50/10 hover:bg-emerald-50/20'}`}
                                                    >
                                                        {getNotifIcon(notif.title)}
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <p className={`text-xs mb-0.5 truncate transition-colors duration-300
                                                                ${notif.isRead ? 'font-bold text-slate-700 group-hover/item:text-emerald-600' : 'font-black text-slate-900 group-hover/item:text-emerald-700'}`}>
                                                                {notif.title}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 font-bold leading-normal mb-1.5 line-clamp-2">
                                                                {notif.content}
                                                            </p>
                                                            <span className="text-[9px] text-slate-400 font-bold">
                                                                {formatTimeAgo(notif.createdAt)}
                                                            </span>
                                                        </div>
                                                        {!notif.isRead && (
                                                            <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-[1.2rem] transition-all duration-300 group shadow-sm bg-white"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg shadow-slate-200/50 group-hover:rotate-3 transition-transform">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                                            <User size={22} />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-emerald-600 transition-colors">{user?.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase opacity-60">
                                        {user?.roles?.[0] === 'ADMIN' ? 'QUẢN TRỊ VIÊN' : user?.roles?.[0] === 'GIAOVU' ? 'GIÁO VỤ' : user?.roles?.[0] === 'GIANGVIEN' ? 'GIẢNG VIÊN' : user?.roles?.[0] === 'SINHVIEN' ? 'SINH VIÊN' : 'KHÁCH'}
                                    </p>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-slate-200/60 py-3 animate-slideUp z-50 overflow-hidden">
                                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 mb-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tài khoản đăng nhập</p>
                                        <p className="text-sm font-black text-slate-900 truncate">{user?.email}</p>
                                    </div>

                                    <div className="px-2 space-y-1">
                                        <button
                                            onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item"
                                        >
                                            <div className="p-2 bg-slate-50 group-hover/item:bg-white rounded-lg transition-colors">
                                                <User size={18} className="text-slate-400 group-hover/item:text-emerald-500" />
                                            </div>
                                            <span>Thông tin cá nhân</span>
                                        </button>

                                        <button 
                                            onClick={() => { navigate('/system-config'); setIsUserMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item"
                                        >
                                            <div className="p-2 bg-slate-50 group-hover/item:bg-white rounded-lg transition-colors">
                                                <Settings size={18} className="text-slate-400 group-hover/item:text-emerald-500" />
                                            </div>
                                            <span>Cấu hình hệ thống</span>
                                        </button>
                                    </div>

                                    <div className="h-px bg-slate-100 my-2 mx-4"></div>

                                    <div className="px-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all group/item"
                                        >
                                            <div className="p-2 bg-rose-50 group-hover/item:bg-white rounded-lg transition-colors">
                                                <LogOut size={18} />
                                            </div>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Vùng hiển thị Module Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative custom-scrollbar w-full">
                    <div className="w-full max-w-7xl mx-auto relative z-10 animate-slideUp">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;