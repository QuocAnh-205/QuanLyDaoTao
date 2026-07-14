// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi';
import { 
    User, Lock, Eye, EyeOff, Award, GraduationCap, Users, 
    BookOpen, Globe, Phone, Mail, HelpCircle, Activity, Info, ShieldCheck
} from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingAuth, setPendingAuth] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showDemoAccounts, setShowDemoAccounts] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    // Auto-login if credentials are saved under local storage (simple remember me)
    useEffect(() => {
        const savedUser = localStorage.getItem('saved_username');
        if (savedUser) {
            setFormData(prev => ({ ...prev, username: savedUser }));
            setRememberMe(true);
        }
    }, []);

    // Success countdown hook
    useEffect(() => {
        let timer;
        if (successMessage && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (successMessage && countdown === 0) {
            if (pendingAuth) {
                setAuth(pendingAuth.token, pendingAuth.user);
            }
            navigate('/dashboard');
        }
        return () => clearTimeout(timer);
    }, [successMessage, countdown, pendingAuth, setAuth, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSelectDemoAccount = (username, password) => {
        setFormData({ username, password });
        setShowDemoAccounts(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username.trim()) {
            setError('Tên đăng nhập không được để trống.');
            return;
        }
        if (!formData.password) {
            setError('Mật khẩu không được để trống.');
            return;
        }

        if (formData.username.trim().length < 3) {
            setError('Tên đăng nhập tối thiểu phải chứa 3 ký tự.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Mật khẩu chưa đủ độ dài (tối thiểu 8 ký tự).');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authApi.login({
                username: formData.username.trim(),
                password: formData.password
            });

            if (response.success) {
                if (rememberMe) {
                    localStorage.setItem('saved_username', formData.username.trim());
                } else {
                    localStorage.removeItem('saved_username');
                }

                setPendingAuth({
                    token: response.data.token,
                    user: response.data.user
                });

                const displayUserName = response.data.user.fullName || response.data.user.username;
                setSuccessMessage(`Chào mừng trở lại, ${displayUserName}! Đang đăng nhập hệ thống...`);
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            const status = err.response?.status;
            const responseCode = err.response?.data?.code;
            const message = err.response?.data?.message;

            if (status === 404 || responseCode === 1005 || message?.includes('không tồn tại')) {
                setError('Tên đăng nhập không tồn tại trên hệ thống.');
            } else if (status === 401 || responseCode === 1006 || message?.includes('mật khẩu')) {
                setError('Mật khẩu không chính xác. Vui lòng nhập lại!');
            } else if (status === 403 || responseCode === 1007 || message?.includes('khóa')) {
                setError('Tài khoản đã bị khóa hoặc không có quyền truy cập.');
            } else {
                setError(message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[160px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none z-0"></div>
            <div className="absolute top-[30%] right-[30%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none z-0"></div>

            {/* Left Hero Section (Grid cols 7) */}
            <div className="hidden lg:flex lg:col-span-7 p-16 flex-col justify-between relative z-10 border-r border-white/5 bg-slate-950/40 backdrop-blur-md">
                {/* Brand Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <GraduationCap className="text-white" size={22} />
                    </div>
                    <div>
                        <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                            stdmanager
                        </span>
                        <span className="text-[9px] font-black tracking-widest text-indigo-500 uppercase block leading-none">Smart Portal</span>
                    </div>
                </div>

                {/* Hero Showcase Content */}
                <div className="space-y-12">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Activity size={12} className="animate-pulse" />
                            Đại Học Số Thông Minh
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-none text-white max-w-2xl">
                            Quản lý học tập và đào tạo <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                                Kỷ Nguyên Mới
                            </span>
                        </h1>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xl">
                            stdmanager cung cấp môi trường quản lý đào tạo số hóa tập trung, kết nối sinh viên, giảng viên và các bộ phận hành chính trong nhà trường một cách tối ưu.
                        </p>
                    </div>

                    {/* Stats counters cards grid */}
                    <div className="grid grid-cols-3 gap-6 max-w-lg">
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Sinh viên</span>
                            <span className="text-2xl font-black text-white block mt-1">15.000+</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Giảng viên</span>
                            <span className="text-2xl font-black text-white block mt-1">450+</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl backdrop-blur-md">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ngành học</span>
                            <span className="text-2xl font-black text-white block mt-1">50+</span>
                        </div>
                    </div>

                    {/* Quick Features List */}
                    <div className="grid grid-cols-2 gap-4 max-w-xl text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Đăng ký học phần & Tín chỉ trực tuyến</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Quản lý điểm thi & Xếp loại học lực</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Thu học phí & Lịch sử giao dịch số</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Khảo thí & Xét tốt nghiệp nhanh gọn</div>
                    </div>
                </div>

                {/* Footer Portal info */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-t border-white/5 pt-8">
                    <span>© {new Date().getFullYear()} stdmanager. All rights reserved.</span>
                    <span className="flex items-center gap-2 text-emerald-500">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                        Hệ thống bảo mật & Trực tuyến
                    </span>
                </div>
            </div>

            {/* Right Login Section (Grid cols 5) */}
            <div className="lg:col-span-5 flex items-center justify-center p-8 relative z-10">
                {/* Language Switcher top right */}
                <div className="absolute top-8 right-8 flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-300">
                    <Globe size={14} className="text-slate-400" />
                    <span>VIE</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">ENG</span>
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Header in Login view for mobile */}
                    <div className="text-center lg:text-left space-y-2">
                        <div className="lg:hidden inline-flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                                <GraduationCap className="text-white" size={18} />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">stdmanager</span>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Đăng Nhập Hệ Thống</h2>
                        <p className="text-slate-400 text-sm font-medium">Nhập thông tin tài khoản Cổng đào tạo của bạn</p>
                    </div>

                    {/* Alert Message */}
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Info size={16} className="text-rose-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="username">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <User size={18} />
                                </span>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    placeholder="Mã số sinh viên / Tài khoản"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest" htmlFor="password">
                                    Mật khẩu
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Extras */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                                />
                                <span className="text-xs text-slate-400 font-bold">Ghi nhớ tài khoản</span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] ${
                                isLoading
                                ? 'bg-indigo-600/40 cursor-not-allowed text-white/50'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                    Đang xác thực...
                                </span>
                            ) : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Demonstration Accounts helper */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2.5rem p-5 space-y-3">
                        <button
                            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                            type="button"
                            className="w-full flex items-center justify-between text-xs font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <span className="flex items-center gap-2"><HelpCircle size={14} /> Tài khoản chạy thử (Demo)</span>
                            <span>{showDemoAccounts ? 'Thu nhỏ' : 'Mở rộng'}</span>
                        </button>
                        
                        {showDemoAccounts && (
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 pt-2 border-t border-white/5 animate-in fade-in duration-200">
                                <button
                                    onClick={() => handleSelectDemoAccount('admin', 'UniItAdmin2026')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-left border border-white/5"
                                >
                                    <span className="block text-white">Quản trị viên</span>
                                    <span>admin / ...</span>
                                </button>
                                <button
                                    onClick={() => handleSelectDemoAccount('giaovu', 'UniItAdmin2026')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-left border border-white/5"
                                >
                                    <span className="block text-white">Giáo vụ phòng</span>
                                    <span>giaovu / ...</span>
                                </button>
                                <button
                                    onClick={() => handleSelectDemoAccount('giangvien', 'UniItAdmin2026')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-left border border-white/5"
                                >
                                    <span className="block text-white">Giảng viên khoa</span>
                                    <span>giangvien / ...</span>
                                </button>
                                <button
                                    onClick={() => handleSelectDemoAccount('sv20200001', 'UniItAdmin2026')}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition text-left border border-white/5"
                                >
                                    <span className="block text-white">Sinh viên</span>
                                    <span>sv20200001 / ...</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Register redirect */}
                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-xs font-bold">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    {/* Support Contact Footer on right panel */}
                    <div className="flex justify-center gap-6 text-[10px] font-black uppercase text-slate-500">
                        <span className="flex items-center gap-1"><Phone size={10} /> Hotline: 1900 8888</span>
                        <span className="flex items-center gap-1"><Mail size={10} /> support@university.edu.vn</span>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.2)] w-full max-w-md text-center relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

                        {/* Animated Checkmark icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
                            <ShieldCheck size={32} />
                        </div>

                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-3">
                            Đăng nhập thành công!
                        </h3>
                        <p className="text-slate-300 text-xs font-bold leading-relaxed px-4">
                            {successMessage}
                        </p>

                        <div className="mt-8 space-y-4">
                            <p className="text-slate-400 text-[10px] tracking-wider uppercase font-semibold">
                                Đang tải giao diện trong <span className="text-emerald-400 font-bold text-sm animate-pulse">{countdown}</span> giây...
                            </p>
                            
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-progress-shrink"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Loader replacement if lucide-react loader spinner not imported
const Loader2 = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default LoginPage;