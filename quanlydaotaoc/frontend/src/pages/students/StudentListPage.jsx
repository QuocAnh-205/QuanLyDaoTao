import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { studentApi } from '../../api/studentApi';
import useAuthStore from '../../store/useAuthStore';
import StudentFormModal from '../../components/StudentFormModal';
import StudentDetailModal from '../../components/StudentDetailModal';
import StudentStatusModal from '../../components/StudentStatusModal';
import {
    Plus, ArrowUpDown, ArrowUp, ArrowDown, UserCheck,
    Users, UserPlus, GraduationCap, Search, Filter,
    MoreVertical, Eye, Edit3, Trash2
} from 'lucide-react';

const StudentListPage = () => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [modalState, setModalState] = useState({
        type: null,
        isOpen: false,
        data: null
    });

    const [filters, setFilters] = useState({
        keyword: '',
        page: 0,
        size: 10,
        classId: '',
        statusId: '',
        sortBy: 'studentCode',
        sortDir: 'asc'
    });

    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const apiParams = {
                ...filters,
                sort: `${filters.sortBy},${filters.sortDir}`
            };

            const response = await studentApi.getAll(apiParams);
            if (response.success) {
                setStudents(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách sinh viên:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, keyword: searchTerm, page: 0 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortDir: prev.sortBy === field && prev.sortDir === 'asc' ? 'desc' : 'asc'
        }));
    };

    const openModal = (type, data = null) => {
        setModalState({ type, isOpen: true, data });
    };

    const closeModal = () => {
        setModalState({ type: null, isOpen: false, data: null });
    };

    const handleDeleteConfirm = async () => {
        console.log('handleDeleteConfirm triggered. Student data:', modalState.data);
        if (!modalState.data?.id) {
            toast.error('Không tìm thấy ID sinh viên để xóa!');
            return;
        }
        setIsDeleting(true);
        try {
            await toast.promise(
                studentApi.delete(modalState.data.id),
                {
                    loading: 'Đang thực hiện xóa sinh viên...',
                    success: 'Xóa sinh viên thành công!',
                    error: (err) => err.response?.data?.message || 'Có lỗi xảy ra khi xóa sinh viên'
                }
            );
            fetchStudents();
            closeModal();
        } catch (error) {
            console.error('Lỗi khi xóa sinh viên:', error);
            toast.error(error.response?.data?.message || error.message || 'Lỗi không xác định khi xóa sinh viên');
        } finally {
            setIsDeleting(false);
        }
    };

    const canEdit = user?.roles?.some(r => ['ADMIN', 'GIAOVU'].includes(r));

    const renderSortableHeader = (label, field) => {
        const isActive = filters.sortBy === field;
        return (
            <th
                className="px-6 py-4 font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-slate-50/50 transition-colors"
                onClick={() => handleSort(field)}
            >
                <div className="flex items-center gap-2">
                    {label}
                    <span className={`transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}>
                        {!isActive ? <ArrowUpDown size={14} /> : filters.sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <div className="space-y-8 animate-slideUp">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-1">
                        <Users size={16} />
                        Hệ thống quản lý
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Danh sách <span className="text-gradient">Sinh viên</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Quản lý hồ sơ, trạng thái học tập và thông tin đào tạo tập trung.</p>
                </div>

                <div className="flex items-center gap-3">
                    {canEdit && (
                        <button
                            onClick={() => openModal('ADD')}
                            className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95"
                        >
                            <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
                            Thêm mới
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Tổng sinh viên', value: totalElements, icon: Users, color: 'blue' },
                    { label: 'Đang học', value: students.filter(s => s.statusCode === 'STUDYING').length, icon: GraduationCap, color: 'emerald' },
                    { label: 'Lớp hành chính', value: '12', icon: Filter, color: 'indigo' }, // Mock value
                    { label: 'Cập nhật mới', value: '24h qua', icon: UserCheck, color: 'amber' } // Mock value
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-5 hover:translate-y-[-4px] transition-all">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Card */}
            <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-2xl shadow-slate-200/50">
                {/* Toolbar */}
                <div className="p-8 border-b border-slate-100 bg-white/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, MSSV hoặc Email..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-2xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl">
                            {[10, 20, 50].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilters(prev => ({ ...prev, size: s, page: 0 }))}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filters.size === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {s} dòng
                                </button>
                            ))}
                        </div>
                        <button className="p-3 bg-slate-100/80 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-100 bg-slate-50/30">
                                {renderSortableHeader('Mã sinh viên', 'studentCode')}
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Họ và Tên</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Lớp hành chính</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-8">
                                            <div className="h-12 bg-slate-100 rounded-2xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <Users size={64} strokeWidth={1} />
                                            <p className="font-bold text-slate-400">Không tìm thấy dữ liệu sinh viên nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                                        <td className="px-6 py-5">
                                            <span className="font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl text-sm tracking-tight">
                                                {student.studentCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 uppercase">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors leading-tight">{student.fullName}</p>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{student.email || 'Chưa cập nhật email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                                {student.className || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${student.statusCode === 'STUDYING' || student.statusCode === 'ACTIVE'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${student.statusCode === 'STUDYING' || student.statusCode === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                                {student.statusName || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => openModal('VIEW', student)}
                                                    className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:shadow-lg rounded-xl transition-all border border-slate-100"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {canEdit && (
                                                    <>
                                                        <button
                                                            onClick={() => openModal('EDIT', student)}
                                                            className="p-2.5 bg-white text-slate-400 hover:text-amber-600 hover:shadow-lg rounded-xl transition-all border border-slate-100"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit3 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openModal('STATUS', student)}
                                                            className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 hover:shadow-lg rounded-xl transition-all border border-slate-100"
                                                            title="Đổi trạng thái"
                                                        >
                                                            <UserCheck size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openModal('DELETE', student)}
                                                            className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:shadow-lg rounded-xl transition-all border border-slate-100"
                                                            title="Xóa sinh viên"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                        Trang <span className="text-slate-800">{filters.page + 1}</span> / {totalPages || 1}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page === 0 || loading}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={filters.page >= totalPages - 1 || loading}
                            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <StudentDetailModal
                isOpen={modalState.isOpen && modalState.type === 'VIEW'}
                onClose={closeModal}
                studentData={modalState.data}
            />

            <StudentFormModal
                isOpen={modalState.isOpen && (modalState.type === 'ADD' || modalState.type === 'EDIT')}
                onClose={closeModal}
                onSuccess={() => {
                    fetchStudents();
                    closeModal();
                }}
                initialData={modalState.type === 'EDIT' ? modalState.data : null}
            />

            <StudentStatusModal
                isOpen={modalState.isOpen && modalState.type === 'STATUS'}
                onClose={closeModal}
                studentData={modalState.data}
                onSuccess={() => {
                    fetchStudents();
                    closeModal();
                }}
            />

            {/* Delete Confirmation Modal */}
            {modalState.isOpen && modalState.type === 'DELETE' && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-md rounded-[2rem] border border-slate-200/80 shadow-2xl p-8 max-w-md w-full animate-scaleUp relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="p-4 rounded-2xl bg-rose-50 text-rose-500 mb-6">
                                <Trash2 size={36} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                                Xác nhận xóa sinh viên
                            </h3>
                            <div className="text-slate-500 font-medium text-sm leading-relaxed mb-6 text-center">
                                Bạn có chắc chắn muốn xóa sinh viên <span className="font-bold text-slate-800">{modalState.data?.fullName}</span> (MSSV: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-bold">{modalState.data?.studentCode}</span>)? 
                                <span className="text-rose-500 font-semibold text-xs mt-3 block p-3 bg-rose-50/50 rounded-2xl border border-rose-100/50 text-left leading-normal">
                                    ⚠️ Hành động này sẽ xóa vĩnh viễn hồ sơ sinh viên, tài khoản đăng nhập, lịch sử học tập, đăng ký học phần và dữ liệu học phí liên quan. Không thể hoàn tác!
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={closeModal}
                                disabled={isDeleting}
                                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="flex-1 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-100 hover:from-red-600 hover:to-rose-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : 'Xóa vĩnh viễn'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentListPage;