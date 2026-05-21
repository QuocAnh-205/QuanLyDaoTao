// src/pages/ForgotPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email Request, 2: OTP & New Password, 3: Success Redirection
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (step === 3 && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (step === 3 && countdown === 0) {
            navigate('/login');
        }
        return () => clearTimeout(timer);
    }, [step, countdown, navigate]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await authApi.forgotPassword({ email });
            if (response.success) {
                setMessage('Hệ thống đã giả lập gửi mã xác thực OTP về email của bạn.');
                setStep(2);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Địa chỉ email không tồn tại trong hệ thống.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 8) {
            setError('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const response = await authApi.resetPassword({
                email,
                otp,
                newPassword
            });
            if (response.success) {
                setStep(3);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Mã xác thực OTP không hợp lệ hoặc đã hết hạn.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
                        Khôi phục Mật khẩu
                    </h2>
                    <p className="text-slate-400 mt-2 text-sm">Lấy lại quyền truy cập vào tài khoản của bạn</p>
                </div>

                {error && (
                    <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-sm text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-5">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs leading-relaxed">
                            💡 Hãy nhập email tài khoản của bạn. Hệ thống sẽ cấp một mã OTP kiểm tra để đặt lại mật khẩu của bạn.
                        </div>

                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
                                Địa chỉ Email đăng ký
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="nguyena@gmail.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-xl text-white font-bold tracking-wide transition-all duration-300 transform active:scale-[0.98] ${
                                isLoading 
                                    ? 'bg-indigo-600/50 cursor-not-allowed text-white/50' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30'
                            }`}
                        >
                            {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi mã xác thực OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                        {message && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs leading-relaxed">
                                {message}
                                <br />
                                <span className="font-bold block mt-1">👉 Vui lòng sử dụng mã OTP mặc định: <span className="underline text-sm font-extrabold">123456</span> để kiểm thử.</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="otp">
                                Mã xác thực OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                required
                                placeholder="Nhập mã 123456"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-center tracking-widest font-extrabold text-lg"
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value); setError(''); }}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="newPassword">
                                Mật khẩu mới (ít nhất 8 ký tự)
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="confirmPassword">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-xl text-white font-bold tracking-wide mt-2 transition-all duration-300 transform active:scale-[0.98] ${
                                isLoading 
                                    ? 'bg-indigo-600/50 cursor-not-allowed text-white/50' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30'
                            }`}
                        >
                            {isLoading ? 'Đang cập nhật mật khẩu...' : 'Cập nhật mật khẩu'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="text-center py-8 space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Mật khẩu đã được đổi thành công!</h3>
                        <p className="text-slate-400 text-sm">
                            Đang tự động chuyển hướng về trang Đăng nhập sau <span className="text-blue-400 font-bold text-base">{countdown}</span> giây...
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/login"
                                className="inline-block py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-colors"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </div>
                )}

                {(step === 1 || step === 2) && (
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                            ← Quay lại trang Đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
