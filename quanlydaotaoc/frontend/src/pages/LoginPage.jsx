// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { authApi } from '../api/authApi';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingAuth, setPendingAuth] = useState(null);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    // Xử lý đếm ngược khi đăng nhập thành công
    useEffect(() => {
        let timer;
        if (successMessage && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (successMessage && countdown === 0) {
            // Chỉ ghi nhận xác thực vào Zustand store sau khi đếm ngược xong
            if (pendingAuth) {
                setAuth(pendingAuth.token, pendingAuth.user);
            }
            navigate('/dashboard');
        }
        return () => clearTimeout(timer);
    }, [successMessage, countdown, pendingAuth, setAuth, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1. Kiểm tra ô trống (Empty validations)
        if (!formData.username.trim()) {
            setError('Tên đăng nhập không được để trống. Vui lòng nhập lại!');
            return;
        }
        if (!formData.password) {
            setError('Mật khẩu không được để trống. Vui lòng nhập lại!');
            return;
        }

        // 2. Kiểm tra độ dài ký tự tối thiểu (Length checks)
        if (formData.username.trim().length < 3) {
            setError('Tên đăng nhập không hợp lệ (phải chứa ít nhất 3 ký tự).');
            return;
        }
        if (formData.password.length < 8) {
            setError('Mật khẩu chưa đủ độ dài (phải chứa ít nhất 8 ký tự). Vui lòng nhập lại!');
            return;
        }

        // 3. Kiểm tra ký tự không hợp lệ (Format checks)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(formData.username.trim())) {
            setError('Tên đăng nhập chứa ký tự không hợp lệ (chỉ chấp nhận chữ cái, số và dấu gạch dưới).');
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API đăng nhập với dữ liệu đã được làm sạch
            const response = await authApi.login({
                username: formData.username.trim(),
                password: formData.password
            });

            if (response.success) {
                // Lưu tạm thông tin xác thực thay vì set ngay lập tức 
                // để tránh PublicRoute chuyển hướng sớm trước khi chạy hết hiệu ứng
                setPendingAuth({
                    token: response.data.token,
                    user: response.data.user
                });

                // Thiết lập thông báo thành công để kích hoạt màn hình đếm ngược
                const displayUserName = response.data.user.fullName || response.data.user.username;
                setSuccessMessage(`Chào mừng trở lại, ${displayUserName}! Khởi tạo phiên làm việc thành công.`);
            }
        } catch (err) {
            // Phân tích và hiển thị lỗi cụ thể
            console.error('Lỗi đăng nhập:', err);
            const status = err.response?.status;
            const responseCode = err.response?.data?.code;
            const message = err.response?.data?.message;

            if (status === 404 || responseCode === 1005 || message?.includes('không tồn tại')) {
                setError('Tên đăng nhập không tồn tại trên hệ thống. Vui lòng kiểm tra lại!');
            } else if (status === 401 || responseCode === 1006 || message?.includes('Chưa xác thực') || message?.includes('mật khẩu')) {
                setError('Mật khẩu không chính xác. Vui lòng kiểm tra kỹ và nhập lại mật khẩu!');
            } else if (status === 403 || responseCode === 1007 || message?.includes('quyền truy cập')) {
                setError('Tài khoản của bạn đã bị khóa hoặc không có quyền truy cập hệ thống.');
            } else {
                setError(message || 'Đăng nhập thất bại. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 hover:shadow-indigo-500/10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
                        stdmanager
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Hệ thống Quản lý Đào tạo Đại học</p>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="username">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Nhập tên đăng nhập của bạn"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider" htmlFor="password">
                                Mật khẩu
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                placeholder="Nhập mật khẩu"
                                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold tracking-wide transition-all duration-300 transform active:scale-[0.98] ${isLoading
                            ? 'bg-indigo-600/50 cursor-not-allowed text-white/50'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30'
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : 'Đăng nhập'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-400 text-sm">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>

            {/* Modal đăng nhập thành công */}
            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] w-full max-w-md text-center animate-scale-up relative overflow-hidden">
                        {/* Hiệu ứng ánh sáng dịu (Glow effect) */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>

                        {/* Biểu tượng Checkmark hoạt họa */}
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path 
                                    className="animate-checkmark"
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="3.5" 
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>

                        {/* Tiêu đề & Thông điệp chào mừng */}
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-3">
                            Đăng nhập thành công!
                        </h3>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed px-2">
                            {successMessage}
                        </p>

                        <div className="mt-8 space-y-4">
                            <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold">
                                Đang chuyển hướng sau <span className="text-emerald-400 font-bold text-sm animate-pulse">{countdown}</span> giây...
                            </p>
                            
                            {/* Thanh tiến trình chuyển động thu hẹp */}
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-progress-shrink"></div>
                            </div>
                        </div>

                        {/* Nút hành động nhanh */}
                        <div className="mt-6 pt-2">
                            <button
                                onClick={() => {
                                    if (pendingAuth) {
                                        setAuth(pendingAuth.token, pendingAuth.user);
                                    }
                                    navigate('/dashboard');
                                }}
                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide uppercase transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/30"
                            >
                                Đi tới Trang chủ ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;