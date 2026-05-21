import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Bell, Settings, Search, Command } from 'lucide-react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                                placeholder="Quick search Command..." 
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
                                    {user?.roles?.[0] || 'GUEST'}
                                </span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200/60 hidden sm:block"></div>

                        {/* Notifications */}
                        <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all relative group shadow-sm bg-white border border-slate-100">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"></span>
                        </button>

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
                                    <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase opacity-60">ADMINISTRATOR</p>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-4 w-64 bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-slate-200/60 py-3 animate-slideUp z-50 overflow-hidden">
                                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 mb-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Identified Access</p>
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
                                            <span>Profile Matrix</span>
                                        </button>

                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all group/item">
                                            <div className="p-2 bg-slate-50 group-hover/item:bg-white rounded-lg transition-colors">
                                                <Settings size={18} className="text-slate-400 group-hover/item:text-emerald-500" />
                                            </div>
                                            <span>System Config</span>
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
                                            <span>Deauthorize</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Vùng hiển thị Module Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-10 relative custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-fadeIn relative z-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;