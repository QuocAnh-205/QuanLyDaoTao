// src/pages/UserManagementPage.jsx
import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import adminApi from '../api/adminApi';
import { 
    Users, Shield, Settings, Search, Plus, Trash2, 
    Lock, Unlock, Edit, ShieldCheck, CheckSquare, Square, 
    Loader2, X, Check, Info, ShieldAlert, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagementPage = () => {
    const { user: currentUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    
    // Pagination & Search States
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userForm, setUserForm] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleUser, setRoleUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const isAdmin = currentUser?.roles?.includes('ADMIN');

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchRoles();
        } else {
            setLoading(false);
        }
    }, [isAdmin, currentPage, keyword]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAllUsers({
                keyword: keyword.trim(),
                page: currentPage,
                size: 10
            });
            if (res.success && res.data) {
                setUsers(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalElements(res.data.totalElements || 0);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
            toast.error('Lỗi kết nối cơ sở dữ liệu người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await adminApi.getAllRoles();
            if (res.success && res.data) {
                setRoles(res.data || []);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách vai trò:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        setKeyword(searchInput);
    };

    const handleToggleStatus = async (userId, username) => {
        if (username === currentUser.username) {
            toast.error('Bạn không thể tự khóa tài khoản của chính mình!');
            return;
        }

        const resolveToast = toast.loading(`Đang cập nhật trạng thái tài khoản ${username}...`);
        try {
            const res = await adminApi.toggleUserStatus(userId);
            if (res.success) {
                toast.success(`Cập nhật trạng thái tài khoản ${username} thành công!`, { id: resolveToast });
                fetchUsers();
            }
        } catch (error) {
            console.error('Lỗi khi thay đổi trạng thái user:', error);
            toast.error('Không thể cập nhật trạng thái tài khoản', { id: resolveToast });
        }
    };

    const openCreateModal = () => {
        setSelectedUser(null);
        setUserForm({
            username: '',
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
        setShowUserModal(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setUserForm({
            username: user.username,
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            password: '',
            confirmPassword: ''
        });
        setShowUserModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        
        // Validations
        if (userForm.username.trim().length < 3) {
            toast.error('Tên đăng nhập phải dài ít nhất 3 ký tự');
            return;
        }

        if (!selectedUser && !userForm.password) {
            toast.error('Mật khẩu không được để trống khi tạo mới');
            return;
        }

        if (userForm.password && userForm.password.length < 8) {
            toast.error('Mật khẩu phải chứa ít nhất 8 ký tự');
            return;
        }

        if (userForm.password !== userForm.confirmPassword) {
            toast.error('Mật khẩu nhập lại không khớp');
            return;
        }

        const resolveToast = toast.loading('Đang xử lý thông tin tài khoản...');
        try {
            let res;
            if (selectedUser) {
                // Update
                const updatePayload = {
                    username: userForm.username.trim(),
                    fullName: userForm.fullName.trim(),
                    email: userForm.email.trim(),
                    phone: userForm.phone.trim(),
                    isActive: selectedUser.isActive
                };
                if (userForm.password) {
                    updatePayload.password = userForm.password;
                }
                res = await adminApi.updateUser(selectedUser.id, updatePayload);
            } else {
                // Create
                const createPayload = {
                    username: userForm.username.trim(),
                    fullName: userForm.fullName.trim(),
                    email: userForm.email.trim(),
                    phone: userForm.phone.trim(),
                    password: userForm.password,
                    isActive: true
                };
                res = await adminApi.createUser(createPayload);
            }

            if (res.success) {
                toast.success(selectedUser ? 'Cập nhật tài khoản thành công!' : 'Tạo tài khoản thành công!', { id: resolveToast });
                setShowUserModal(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Lỗi khi lưu user:', error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu tài khoản';
            toast.error(errorMsg, { id: resolveToast });
        }
    };

    const openRoleModal = (user) => {
        setRoleUser(user);
        const roleCodes = (user.roles || []).map(r => typeof r === 'string' ? r : r.code);
        setSelectedRoles(roleCodes);
        setShowRoleModal(true);
    };

    const handleRoleCheckboxChange = (roleCode) => {
        if (selectedRoles.includes(roleCode)) {
            // Cannot remove last role
            if (selectedRoles.length === 1) {
                toast.error('Tài khoản phải sở hữu tối thiểu 1 vai trò!');
                return;
            }
            // Cannot self-revoke admin
            if (roleUser.username === currentUser.username && roleCode === 'ADMIN') {
                toast.error('Bạn không thể tự tước quyền quản trị ADMIN của chính mình!');
                return;
            }
            setSelectedRoles(selectedRoles.filter(r => r !== roleCode));
        } else {
            setSelectedRoles([...selectedRoles, roleCode]);
        }
    };

    const handleSaveRoles = async () => {
        if (selectedRoles.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 vai trò');
            return;
        }

        const resolveToast = toast.loading(`Đang phân quyền cho tài khoản ${roleUser.username}...`);
        try {
            const res = await adminApi.assignRoles(roleUser.id, selectedRoles);
            if (res.success) {
                toast.success(`Phân quyền tài khoản ${roleUser.username} thành công!`, { id: resolveToast });
                setShowRoleModal(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Lỗi gán vai trò:', error);
            const errorMsg = error.response?.data?.message || 'Không thể cập nhật danh sách vai trò';
            toast.error(errorMsg, { id: resolveToast });
        }
    };

    // 403 Fallback screen if user is not ADMIN
    if (!isAdmin) {
        return (
            <div className="w-full max-w-xl mx-auto py-16 px-4 animate-slideUp">
                <div className="bg-white rounded-[3.5rem] p-12 text-center border border-rose-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
                    <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-100 shadow-lg shadow-rose-200/30">
                        <ShieldAlert size={40} className="animate-pulse" />
                    </div>
                    <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-100 shadow-sm inline-block mb-4">
                        Quyền truy cập bị từ chối
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter uppercase leading-none">Security 403</h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed mb-10 max-w-sm mx-auto">
                        Mục này chỉ dành riêng cho Quản trị viên tối cao (ADMIN). Tài khoản hiện tại của bạn không có đủ thẩm quyền hoạt động.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3.5 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 duration-300"
                    >
                        Quay lại an toàn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-slideUp">
            {/* Top Header Grid Banner */}
            <div className="bg-white rounded-[3rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-purple-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl -ml-24 -mb-24"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-[1.8rem] flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                        <Users size={28} className="text-purple-400" />
                    </div>
                    <div>
                        <span className="bg-purple-50 text-purple-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-purple-100 shadow-sm inline-block mb-2">
                            Cổng kiểm soát hệ thống
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Quản trị hệ thống</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
                            <ShieldCheck size={12} className="text-purple-500" /> Phân quyền người dùng & Tài khoản
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10 shrink-0">
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-purple-600 text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 hover:shadow-purple-500/25 active:scale-95 uppercase tracking-[0.2em]"
                    >
                        <Plus size={14} /> Thêm tài khoản
                    </button>
                </div>
            </div>

            {/* Core Tabs Navigation */}
            <div className="flex gap-4 border-b border-slate-100 pb-2">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative transition-all ${
                        activeTab === 'users' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <span className="flex items-center gap-2"><Users size={14} /> Danh sách tài khoản ({totalElements})</span>
                </button>
                <button
                    onClick={() => setActiveTab('roles')}
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative transition-all ${
                        activeTab === 'roles' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <span className="flex items-center gap-2"><Shield size={14} /> Bảng phân quyền vai trò</span>
                </button>
            </div>

            {/* Tab Content Panel */}
            {activeTab === 'users' ? (
                /* TAB 1: USER ACCOUNTS MATRIX */
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-6">
                    {/* Search & Filter bar */}
                    <form onSubmit={handleSearchSubmit} className="flex gap-4">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus-within:ring-4 focus-within:ring-purple-500/5 focus-within:border-purple-500/50 transition-all group">
                            <Search size={16} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản (Username, Họ tên, Email, SĐT)..."
                                className="bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-slate-400 flex-1"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                        >
                            Tìm kiếm
                        </button>
                    </form>

                    {/* Users Grid Table */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Loader2 size={32} className="animate-spin text-purple-500" />
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Đang nạp ma trận tài khoản...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <Info size={32} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-400 text-xs font-bold">Không tìm thấy tài khoản nào khớp với bộ lọc.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">Tên đăng nhập</th>
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">Họ và tên</th>
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">Email / SĐT</th>
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider">Vai trò (Role)</th>
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-center">Trạng thái</th>
                                        <th className="py-4 px-4 text-[9px] font-black uppercase text-slate-400 tracking-wider text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            {/* Username */}
                                            <td className="py-4 px-4">
                                                <span className="text-xs font-black text-slate-900 block">{u.username}</span>
                                                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">ID: {u.id.substring(0, 8)}...</span>
                                            </td>

                                            {/* Full Name */}
                                            <td className="py-4 px-4 text-xs font-bold text-slate-700">
                                                {u.fullName || <span className="text-slate-300 italic">Chưa cập nhật</span>}
                                            </td>

                                            {/* Email & Phone */}
                                            <td className="py-4 px-4">
                                                <span className="text-xs font-bold text-slate-600 block">{u.email}</span>
                                                {u.phone && <span className="text-[10px] text-slate-400 block mt-0.5">{u.phone}</span>}
                                            </td>

                                            {/* Roles */}
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(u.roles || []).map((role) => {
                                                        const colors = {
                                                            ADMIN: 'bg-purple-50 text-purple-600 border-purple-100',
                                                            GIAOVU: 'bg-green-50 text-green-600 border-green-100',
                                                            GIANGVIEN: 'bg-blue-50 text-blue-600 border-blue-100',
                                                            SINHVIEN: 'bg-orange-50 text-orange-600 border-orange-100'
                                                        };
                                                        const roleCode = typeof role === 'string' ? role : role.code;
                                                        return (
                                                            <span
                                                                key={roleCode}
                                                                className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border shadow-sm ${
                                                                    colors[roleCode] || 'bg-slate-50 text-slate-600 border-slate-100'
                                                                }`}
                                                            >
                                                                {roleCode}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </td>

                                            {/* Status toggle */}
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(u.id, u.username)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                                                        u.isActive
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm'
                                                    }`}
                                                >
                                                    {u.isActive ? (
                                                        <>
                                                            <Unlock size={10} /> Đang hoạt động
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock size={10} /> Đã khóa
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openRoleModal(u)}
                                                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors border border-indigo-100"
                                                        title="Phân quyền vai trò"
                                                    >
                                                        <Shield size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(u)}
                                                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors border border-slate-100"
                                                        title="Sửa thông tin"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-slate-50 pt-5 text-xs font-bold text-slate-400">
                                    <span>Đang hiển thị trang {currentPage + 1}/{totalPages}</span>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={currentPage === 0}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl active:scale-95 disabled:opacity-50 transition"
                                        >
                                            Trước
                                        </button>
                                        <button
                                            disabled={currentPage === totalPages - 1}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl active:scale-95 disabled:opacity-50 transition"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* TAB 2: ROLE MATRIX & PERMISSIONS */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <RoleCard
                        roleCode="ADMIN"
                        roleName="Quản trị viên tối cao"
                        description="Toàn quyền điều phối, cấu hình hệ thống, quản lý tài khoản và phân quyền."
                        color="bg-purple-50/50 border-purple-100 text-purple-700"
                        users={users.filter(u => (u.roles || []).some(r => (typeof r === 'string' ? r : r.code) === 'ADMIN'))}
                    />
                    <RoleCard
                        roleCode="GIAOVU"
                        roleName="Giáo vụ phòng đào tạo"
                        description="Quản lý hồ sơ học sinh sinh viên, cấu hình lớp, học kỳ, thời khóa biểu và thu học phí."
                        color="bg-emerald-50/50 border-emerald-100 text-emerald-700"
                        users={users.filter(u => (u.roles || []).some(r => (typeof r === 'string' ? r : r.code) === 'GIAOVU'))}
                    />
                    <RoleCard
                        roleCode="GIANGVIEN"
                        roleName="Giảng viên Khoa"
                        description="Xem thời khóa biểu giảng dạy, thiết lập trọng số điểm, quản lý điểm và khóa điểm môn học."
                        color="bg-blue-50/50 border-blue-100 text-blue-700"
                        users={users.filter(u => (u.roles || []).some(r => (typeof r === 'string' ? r : r.code) === 'GIANGVIEN'))}
                    />
                    <RoleCard
                        roleCode="SINHVIEN"
                        roleName="Học sinh / Sinh viên"
                        description="Xem thời khóa biểu học tập, xem bảng điểm học tập cá nhân, đăng ký học phần và đóng học phí."
                        color="bg-orange-50/50 border-orange-100 text-orange-700"
                        users={users.filter(u => (u.roles || []).some(r => (typeof r === 'string' ? r : r.code) === 'SINHVIEN'))}
                    />
                </div>
            )}

            {/* USER SAVE MODAL */}
            {showUserModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 w-full max-w-lg relative overflow-hidden animate-scaleUp">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                {selectedUser ? 'Sửa thông tin tài khoản' : 'Tạo tài khoản mới'}
                            </h3>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!selectedUser}
                                        placeholder="Username"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500 disabled:bg-slate-100"
                                        value={userForm.username}
                                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Họ và tên</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                                        value={userForm.fullName}
                                        onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Địa chỉ Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                                        value={userForm.email}
                                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Số điện thoại</label>
                                    <input
                                        type="text"
                                        placeholder="0912345678"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                                        value={userForm.phone}
                                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                                        {selectedUser ? 'Mật khẩu mới (Bỏ trống nếu giữ nguyên)' : 'Mật khẩu'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!selectedUser}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                                        value={userForm.password}
                                        onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        required={!selectedUser && userForm.password}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500"
                                        value={userForm.confirmPassword}
                                        onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowUserModal(false)}
                                    className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider active:scale-95 transition"
                                >
                                    Lưu lại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ROLE ASSIGNMENT MODAL (PHÂN QUYỀN) */}
            {showRoleModal && roleUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 w-full max-w-md relative overflow-hidden animate-scaleUp">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Phân quyền vai trò</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Tài khoản: {roleUser.username}</p>
                            </div>
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* List Roles checkboxes */}
                        <div className="space-y-3">
                            {['ADMIN', 'GIAOVU', 'GIANGVIEN', 'SINHVIEN'].map((roleCode) => {
                                const roleMeta = {
                                    ADMIN: { name: 'ADMIN — Quản trị tối cao', color: 'text-purple-600' },
                                    GIAOVU: { name: 'GIAOVU — Giáo vụ đào tạo', color: 'text-emerald-600' },
                                    GIANGVIEN: { name: 'GIANGVIEN — Giảng viên khoa', color: 'text-blue-600' },
                                    SINHVIEN: { name: 'SINHVIEN — Học sinh sinh viên', color: 'text-orange-600' }
                                };
                                const meta = roleMeta[roleCode] || { name: roleCode, color: 'text-slate-600' };
                                const isChecked = selectedRoles.includes(roleCode);

                                return (
                                    <button
                                        key={roleCode}
                                        onClick={() => handleRoleCheckboxChange(roleCode)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                                            isChecked 
                                                ? 'bg-slate-50 border-purple-200 shadow-sm' 
                                                : 'hover:bg-slate-50/50 border-slate-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${isChecked ? 'text-purple-500' : 'text-slate-300'} shrink-0`}>
                                                {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </div>
                                            <span className="text-xs font-black text-slate-800">{meta.name}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 mt-6">
                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="px-6 py-3 border border-slate-200 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSaveRoles}
                                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider active:scale-95 transition"
                            >
                                Xác nhận gán quyền
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-component for Role Card (Tab 2)
const RoleCard = ({ roleCode, roleName, description, color, users = [] }) => (
    <div className={`bg-white border rounded-[2.2rem] p-6 shadow-xl flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:shadow-2xl`}>
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white shrink-0 shadow-lg">
                    <Shield size={20} className="text-purple-400" />
                </div>
                <span className={`text-[8.5px] font-black uppercase tracking-widest px-3 py-1 border rounded-full ${color}`}>
                    {roleCode}
                </span>
            </div>
            
            <div className="space-y-2">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{roleName}</h4>
                <p className="text-[10.5px] font-bold text-slate-400 leading-normal">{description}</p>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-50 mt-6 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                <span>Số lượng tài khoản</span>
                <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">{users.length}</span>
            </div>

            {/* List mini avatars/names */}
            {users.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-y-auto">
                    {users.slice(0, 5).map(u => (
                        <span key={u.id} className="text-[9.5px] font-black bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-100" title={u.fullName}>
                            {u.username}
                        </span>
                    ))}
                    {users.length > 5 && (
                        <span className="text-[9.5px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-200">
                            +{users.length - 5}
                        </span>
                    )}
                </div>
            ) : (
                <p className="text-[9.5px] text-slate-400 italic">Không có người dùng nào thuộc vai trò này.</p>
            )}
        </div>
    </div>
);

export default UserManagementPage;
