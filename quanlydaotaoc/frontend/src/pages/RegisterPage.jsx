// src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { 
    User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, 
    GraduationCap, Check, ArrowLeft, Info, HelpCircle
} from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Success countdown redirect hook
    useEffect(() => {
        let timer;
        if (successMessage && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (successMessage && countdown === 0) {
            navigate('/login');
        }
        return () => clearTimeout(timer);
    }, [successMessage, countdown, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Form validations
        if (formData.username.trim().length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự (Ví dụ: MSSV của bạn).');
            return;
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username.trim())) {
            setError('Tên đăng nhập chỉ gồm chữ cái, số và dấu gạch dưới.');
            return;
        }

        if (formData.fullName.trim().length < 2) {
            setError('Họ và tên của bạn chưa hợp lệ.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError('Địa chỉ email không đúng định dạng.');
            return;
        }

        if (formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.trim())) {
            setError('Số điện thoại phải gồm 10 hoặc 11 chữ số.');
            return;
        }

        if (formData.password.length < 8) {
            setError('Mật khẩu phải chứa ít nhất 8 ký tự.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận nhập lại không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            const dataToSubmit = {
                username: formData.username.trim(),
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password
            };

            const response = await authApi.register(dataToSubmit);

            if (response.success) {
                setSuccessMessage('Tài khoản sinh viên đã được khởi tạo thành công trên hệ thống!');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Đăng ký thất bại. Tên tài khoản hoặc email có thể đã tồn tại.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
            {/* Background glowing blobs */}
            <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[180px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none z-0"></div>
            <div className="absolute top-[20%] right-[40%] w-[35%] h-[35%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0"></div>

            {/* Left Hero Section (Consistent style, Grid cols 5 for registration to give form more space) */}
            <div className="hidden lg:flex lg:col-span-5 p-16 flex-col justify-between relative z-10 border-r border-white/5 bg-slate-950/40 backdrop-blur-md">
                {/* Brand Header */}
                <Link to="/login" className="flex items-center gap-3 w-fit group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap className="text-white" size={22} />
                    </div>
                    <div>
                        <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                            stdmanager
                        </span>
                        <span className="text-[9px] font-black tracking-widest text-indigo-500 block leading-none uppercase">Cổng Học Sinh Sinh Viên</span>
                    </div>
                </Link>

                {/* Promotional content for Students */}
                <div className="space-y-10 my-auto">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tight leading-tight text-white">
                            Khởi tạo tài khoản <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                                Học tập số của bạn
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                            Đăng ký tài khoản để đồng bộ hóa học bạ điện tử, tham gia đăng ký tín chỉ trực tuyến, tra cứu học phí và tương tác trực tiếp với các phòng ban đào tạo.
                        </p>
                    </div>

                    {/* Simple Step Guidelines */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 text-xs font-bold">1</div>
                            <div>
                                <span className="text-sm font-bold text-slate-200 block">Đăng ký bằng mã số sinh viên (MSSV)</span>
                                <span className="text-xs text-slate-400 mt-1 block">Tên đăng nhập nên trùng khớp với MSSV được nhà trường cấp để đồng bộ dữ liệu.</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 text-xs font-bold">2</div>
                            <div>
                                <span className="text-sm font-bold text-slate-200 block">Kích hoạt tài khoản & Đồng bộ điểm</span>
                                <span className="text-xs text-slate-400 mt-1 block">Hồ sơ học tập của bạn sẽ được kích hoạt tức thì sau khi đăng ký thành công.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to login button */}
                <div>
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} /> Quay lại trang Đăng nhập
                    </Link>
                </div>
            </div>

            {/* Right Registration Form Section (Grid cols 7 - spacious and clean) */}
            <div className="lg:col-span-7 flex items-center justify-center p-8 lg:p-16 relative z-10 overflow-y-auto">
                <div className="w-full max-w-xl space-y-6">
                    {/* Header in Form */}
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Đăng Ký Tài Khoản</h2>
                        <p className="text-slate-400 text-sm font-medium">Nhập thông tin để tạo mới hồ sơ học sinh, sinh viên trên hệ thống</p>
                    </div>

                    {/* Frontend Validation Alerts */}
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
                            <Info size={16} className="text-rose-400 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Two Columns Grid for balanced readability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tên đăng nhập */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="username">
                                    Tên đăng nhập (Nên đặt theo MSSV)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <User size={16} />
                                    </span>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        placeholder="Ví dụ: sv20210009"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Họ và tên */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="fullName">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <User size={16} />
                                    </span>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        required
                                        placeholder="Ví dụ: Nguyễn Văn B"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Địa chỉ Email */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="email">
                                    Địa chỉ Email
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Mail size={16} />
                                    </span>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="nguyenvanb@university.edu.vn"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="phone">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Phone size={16} />
                                    </span>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="Ví dụ: 0987654321"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Mật khẩu */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="password">
                                    Mật khẩu (Tối thiểu 8 ký tự)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div className="space-y-1.5">
                                <label className="text-slate-300 text-[10px] font-black uppercase tracking-widest block" htmlFor="confirmPassword">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-xs font-bold"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Agreement Terms */}
                        <div className="text-[10px] text-slate-500 font-bold leading-relaxed pt-2">
                            Bằng cách nhấp vào nút đăng ký, bạn đồng ý với các <span className="text-indigo-400 cursor-pointer hover:underline">Quy chế đào tạo</span> và <span className="text-indigo-400 cursor-pointer hover:underline">Chính sách bảo mật dữ liệu sinh viên</span> của hệ thống stdmanager.
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 px-4 rounded-xl text-white font-black text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-[0.98] ${
                                isLoading
                                ? 'bg-indigo-600/40 cursor-not-allowed text-white/50'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/20'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                    Đang tạo hồ sơ...
                                </span>
                            ) : 'Đăng ký tài khoản'}
                        </button>
                    </form>

                    {/* Redirect to login for Mobile */}
                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-xs font-bold">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>

                    {/* Quick Help Tip */}
                    <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex gap-3 text-[10px] font-bold text-slate-400">
                        <HelpCircle size={16} className="text-indigo-400 shrink-0" />
                        <span>Mọi vướng mắc về đồng bộ dữ liệu hoặc cấp tài khoản tự động, sinh viên vui lòng liên hệ phòng Khảo thí & Đảm bảo chất lượng hoặc email quản trị.</span>
                    </div>
                </div>
            </div>

            {/* Success Animation Modal */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.2)] w-full max-w-md text-center relative overflow-hidden">
                        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

                        {/* Checkmark icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                            <Check size={32} />
                        </div>

                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-3">
                            Đăng ký thành công!
                        </h3>
                        <p className="text-slate-300 text-xs font-bold leading-relaxed px-4">
                            {successMessage}
                        </p>

                        <div className="mt-8 space-y-4">
                            <p className="text-slate-400 text-[10px] tracking-wider uppercase font-semibold">
                                Đang chuyển hướng về Đăng nhập sau <span className="text-blue-400 font-bold text-sm animate-pulse">{countdown}</span> giây...
                            </p>
                            
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full animate-progress-shrink"></div>
                            </div>
                        </div>

                        <div className="mt-6 pt-2">
                            <Link
                                to="/login"
                                className="w-full block text-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-indigo-900/30"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Spinner loader component
const Loader2 = ({ className }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default RegisterPage;
